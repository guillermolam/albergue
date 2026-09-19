---
applyTo: "**/*"
---

These are some guidelines when using the SonarQube MCP server.

# Important Tool Guidelines

## Basic usage

Follow this workflow in order for every code-editing task:

1. At task start: disable automatic analysis with the `toggle_automatic_analysis` tool if it exists.
2. Immediately after your final code edit in this response, before ending your turn: call the `analyze_file_list` tool (if it exists) to analyze the files you created or modified.
3. Immediately after that: re-enable automatic analysis with the `toggle_automatic_analysis` tool if it exists.

- If only one of `toggle_automatic_analysis` or `analyze_file_list` exists, proceed with the available tool and skip the missing step without error.
- If a tool call fails, inform the user and continue without blocking the task.
- Repeat this disable/analyze/re-enable cycle for each new distinct task, even within the same session.

## Project Keys

- When a user mentions a project key, use `search_my_sonarqube_projects` first to find the exact project key
- Don't guess project keys - always look them up

## Code Language Detection

- When analyzing code snippets, try to detect the programming language from the code syntax
- If confidence in language detection is below a reasonable threshold, ask the user; otherwise proceed with the most likely language based on syntax

## Branch and Pull Request Context

- Many operations support branch-specific analysis
- If user mentions working on a feature branch, include the branch parameter

## Code Issues and Violations

- After fixing issues, do not attempt to verify them using `search_sonar_issues_in_projects`, as the server will not yet reflect the updates

# Common Troubleshooting

## Authentication Issues

- SonarQube requires USER tokens (not project tokens)
- When the error `SonarQube answered with Not authorized` occurs, verify the token type

## Project Not Found

- Use `search_my_sonarqube_projects` to find available projects
- Verify project key spelling and format

## Code Analysis Issues

- Ensure programming language is correctly specified
- Remind users that snippet analysis doesn't replace full project scans
- Provide full file content for better analysis results
