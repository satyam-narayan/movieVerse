package com.movieverse

import okhttp3.Dns
import java.net.InetAddress
import java.net.UnknownHostException
import java.net.URL
import java.net.HttpURLConnection
import java.io.BufferedReader
import java.io.InputStreamReader
import org.json.JSONObject
import android.util.Log

class DohDns : Dns {
    private val TAG = "DohDns"

    override fun lookup(hostname: String): List<InetAddress> {
        if (hostname.endsWith("themoviedb.org") || hostname.endsWith("tmdb.org")) {
            Log.d(TAG, "Resolving blocked host using DoH: $hostname")
            try {
                val ips = resolveDoh(hostname)
                if (ips.isNotEmpty()) {
                    Log.d(TAG, "Resolved $hostname to: $ips")
                    return ips.map { InetAddress.getByName(it) }
                }
            } catch (e: Exception) {
                Log.e(TAG, "DoH resolution failed for $hostname, falling back to system DNS", e)
            }
        }
        return Dns.SYSTEM.lookup(hostname)
    }

    private fun resolveDoh(hostname: String): List<String> {
        // Try Cloudflare first, then Google DNS
        val providers = listOf(
            "https://1.1.1.1/dns-query?name=$hostname&type=A",
            "https://8.8.8.8/resolve?name=$hostname&type=A"
        )
        for (urlStr in providers) {
            try {
                val url = URL(urlStr)
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.connectTimeout = 3000
                conn.readTimeout = 3000
                conn.setRequestProperty("Accept", "application/dns-json")
                
                val responseCode = conn.responseCode
                if (responseCode == 200) {
                    val reader = BufferedReader(InputStreamReader(conn.inputStream))
                    val response = StringBuilder()
                    var line: String?
                    while (reader.readLine().also { line = it } != null) {
                        response.append(line)
                    }
                    reader.close()
                    
                    val json = JSONObject(response.toString())
                    val answers = json.optJSONArray("Answer")
                    if (answers != null && answers.length() > 0) {
                        val ips = mutableListOf<String>()
                        for (i in 0 until answers.length()) {
                            val answer = answers.getJSONObject(i)
                            // type 1 is A record (IPv4)
                            if (answer.optInt("type") == 1) {
                                val data = answer.optString("data")
                                if (data.isNotEmpty()) {
                                    ips.add(data)
                                }
                            }
                        }
                        if (ips.isNotEmpty()) {
                            return ips
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error resolving via $urlStr: ${e.message}", e)
            }
        }
        return emptyList()
    }
}
