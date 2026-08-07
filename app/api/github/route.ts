import { NextResponse } from 'next/server';

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

export async function GET() {
  const username = 'snvadivelabi11-boop';

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Abishek-Digital-Portfolio',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch GitHub profile' },
        { status: profileRes.status }
      );
    }

    const profile: GitHubProfile = await profileRes.json();

    // Fetch Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    let repositories: GitHubRepo[] = [];
    if (reposRes.ok) {
      const allRepos: GitHubRepo[] = await reposRes.json();
      repositories = allRepos.filter((r) => !r.fork);
    }

    return NextResponse.json({
      success: true,
      profile: {
        login: profile.login,
        name: profile.name || 'Abishek',
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        bio: profile.bio || 'Full Stack Developer & AI Creator',
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
      },
      repositories: repositories.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || 'Open source project repository',
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language || 'TypeScript',
        updated_at: r.updated_at,
      })),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Network error fetching GitHub data' },
      { status: 500 }
    );
  }
}
