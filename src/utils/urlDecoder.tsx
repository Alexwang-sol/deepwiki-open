export function extractUrlDomain(input: string): string | null {
    try {
        const baseOrOriginalUrl = getGitRepoBaseUrl(input); // Use the optimized function
        const url = new URL(baseOrOriginalUrl);
        return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`; // Inclut le protocole et le domaine
    } catch (error) {
        console.error("Error in extractUrlDomain:", error);
        return null; // Not a valid URL
    }
}

export function getGitRepoBaseUrl(input: string): string {
    try {
        const normalizedInput = input.startsWith('http') ? input : `https://${input}`;
        // Regex to capture the base URL before /-/tree/(master|main)
        const gitRepoUrlRegex = /^(https?:\/\/[^\/]+(?:\/[^\/]+)*?)\/-\/tree\/(master|main)(?:\/.*)?$/;
        const match = normalizedInput.match(gitRepoUrlRegex);

        if (match) {
            return match[1]; // The first captured group is the base URL
        } else {
            return normalizedInput; // If no match, return the original normalized input
        }
    } catch {
        return input; // Fallback to original input if URL parsing fails
    }
}

export function getGitPathInRepo(input: string): string | null {
    try {
        const normalizedInput = input.startsWith('http') ? input : `https://${input}`;
        const url = new URL(normalizedInput);
        const path = url.pathname;

        const treeBranchRegex = /\/-\/tree\/(master|main)(?:\/(.*))?/;
        const match = path.match(treeBranchRegex);

        if (match) {
            return match[2] ? match[2].replace(/^\/|\/$/g, '') : ''; // Return pathInRepo, remove leading/trailing slashes
        } else {
            return null; // Not a Git repo URL of the specified format
        }
    } catch {
        return null; // Not a valid URL
    }
}

export function extractUrlPath(input: string): string | null {
    try {
        const baseOrOriginalUrl = getGitRepoBaseUrl(input); // Use the optimized function
        const url = new URL(baseOrOriginalUrl);
        return url.pathname.replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes
    } catch {
        return null; // Not a valid URL
    }
}
