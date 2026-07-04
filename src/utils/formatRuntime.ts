export const formatRuntime = (mins: number | null): string => {
    if (!mins) return 'N/A';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
};