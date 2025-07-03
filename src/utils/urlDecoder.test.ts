import { extractUrlDomain, getGitRepoBaseUrl, getGitPathInRepo, extractUrlPath } from './urlDecoder';

describe('URL Utility Functions', () => {

    // Test cases for getGitRepoBaseUrl
    describe('getGitRepoBaseUrl', () => {
        it('should extract the base URL for master branch with path', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master/public/docs';
            expect(getGitRepoBaseUrl(url)).toBe('https://git.huya.info/huya_infra/deepwiki-open');
        });

        it('should extract the base URL for main branch with path', () => {
            const url = 'https://git.huya.info/huya_infra/another-repo/-/tree/main/src/components';
            expect(getGitRepoBaseUrl(url)).toBe('https://git.huya.info/huya_infra/another-repo');
        });

        it('should extract the base URL for master branch without trailing path', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master';
            expect(getGitRepoBaseUrl(url)).toBe('https://git.huya.info/huya_infra/deepwiki-open');
        });

        it('should extract the base URL for main branch without trailing path', () => {
            const url = 'https://git.huya.info/huya_infra/another-repo/-/tree/main';
            expect(getGitRepoBaseUrl(url)).toBe('https://git.huya.info/huya_infra/another-repo');
        });

        it('should return the original URL if not a git repo URL', () => {
            const url = 'https://www.example.com/some/path';
            expect(getGitRepoBaseUrl(url)).toBe('https://www.example.com/some/path');
        });

        it('should handle URLs without protocol', () => {
            const url = 'git.huya.info/huya_infra/deepwiki-open/-/tree/master/public';
            expect(getGitRepoBaseUrl(url)).toBe('https://git.huya.info/huya_infra/deepwiki-open');
        });

        it('should handle URLs with port', () => {
            const url = 'https://git.huya.info:8080/huya_infra/deepwiki-open/-/tree/master/public';
            expect(getGitRepoBaseUrl(url)).toBe('https://git.huya.info:8080/huya_infra/deepwiki-open');
        });
    });

    // Test cases for getGitPathInRepo
    describe('getGitPathInRepo', () => {
        it('should extract the path in repo for master branch', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master/public/docs';
            expect(getGitPathInRepo(url)).toBe('public/docs');
        });

        it('should extract the path in repo for main branch', () => {
            const url = 'https://git.huya.info/huya_infra/another-repo/-/tree/main/src/components';
            expect(getGitPathInRepo(url)).toBe('src/components');
        });

        it('should return empty string if no path after master/main', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master';
            expect(getGitPathInRepo(url)).toBe('');
        });

        it('should return null if not a git repo URL', () => {
            const url = 'https://www.example.com/some/path';
            expect(getGitPathInRepo(url)).toBeNull();
        });

        it('should handle URLs without protocol', () => {
            const url = 'git.huya.info/huya_infra/deepwiki-open/-/tree/master/public';
            expect(getGitPathInRepo(url)).toBe('public');
        });
    });

    // Test cases for extractUrlDomain
    describe('extractUrlDomain', () => {
        it('should extract domain from a standard URL', () => {
            const url = 'https://www.example.com/path/to/page';
            expect(extractUrlDomain(url)).toBe('https://www.example.com');
        });

        it('should extract domain from a standard URL without protocol', () => {
            const url = 'www.example.com/path/to/page';
            expect(extractUrlDomain(url)).toBe('https://www.example.com');
        });

        it('should extract domain from a standard URL with port', () => {
            const url = 'http://localhost:3000/api';
            expect(extractUrlDomain(url)).toBe('http://localhost:3000');
        });

        it('should extract domain from a git repo URL (master branch)', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master/public';
            expect(extractUrlDomain(url)).toBe('https://git.huya.info');
        });

        it('should extract domain from a git repo URL (main branch)', () => {
            const url = 'https://git.huya.info/huya_infra/another-repo/-/tree/main/src';
            expect(extractUrlDomain(url)).toBe('https://git.huya.info');
        });
    });

    // Test cases for extractUrlPath
    describe('extractUrlPath', () => {
        it('should extract path from a standard URL', () => {
            const url = 'https://www.example.com/path/to/page';
            expect(extractUrlPath(url)).toBe('path/to/page');
        });

        it('should extract path from a standard URL with trailing slash', () => {
            const url = 'https://www.example.com/path/to/page/';
            expect(extractUrlPath(url)).toBe('path/to/page');
        });

        it('should extract path from a standard URL with query params', () => {
            const url = 'https://www.example.com/path/to/page?query=test';
            expect(extractUrlPath(url)).toBe('path/to/page');
        });

        it('should extract path from a git repo URL (master branch)', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master/public/docs';
            expect(extractUrlPath(url)).toBe('huya_infra/deepwiki-open');
        });

        it('should extract path from a git repo URL (main branch)', () => {
            const url = 'https://git.huya.info/huya_infra/another-repo/-/tree/main/src/components';
            expect(extractUrlPath(url)).toBe('huya_infra/another-repo');
        });

        it('should return normal path for git repo URL with no path after branch', () => {
            const url = 'https://git.huya.info/huya_infra/deepwiki-open/-/tree/master';
            expect(extractUrlPath(url)).toBe('huya_infra/deepwiki-open');
        });

        it('should return empty string for root path', () => {
            const url = 'https://www.example.com/';
            expect(extractUrlPath(url)).toBe('');
        });

        it('should return null for invalid URLs', () => {
            const url = 'invalid-url';
            expect(extractUrlPath(url)).toBe('');
        });
    });
});
