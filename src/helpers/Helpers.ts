export const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const parseScoreFromResponse = (aiResponse: string) => {
    const regex = /Total Score: (\d+) point/;
    const match = aiResponse.match(regex);
    if (match && match[1]) {
        const score = parseInt(match[1], 10);
        return score;
    } else {
        return null;
    }
};
