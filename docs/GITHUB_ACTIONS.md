# GitHub Actions Workflows

This document describes all GitHub Actions workflows configured for the project.

## 🔄 Workflows Overview

### 1. CI (`ci.yml`)
**Purpose**: Continuous Integration - Runs on every PR and push to main/develop

**Jobs**:
- **Lint**: Runs ESLint across all packages
- **Build**: Matrix build for backend, realtime, and admin apps
- **Test Backend**: Runs backend tests with Postgres + Redis services
- **Migration Check**: Validates database migrations with PostGIS
- **Security Scan**: Trivy vulnerability scanning (HIGH/CRITICAL)
- **CodeQL Analysis**: Static code analysis for security vulnerabilities

**Features**:
- ✅ Dependency caching for faster builds
- ✅ Parallel job execution
- ✅ Service containers (Postgres + PostGIS, Redis)
- ✅ Security scanning with SARIF upload
- ✅ Concurrency control (cancels duplicate runs)

**Triggers**: `pull_request`, `push` to `main`/`develop`

---

### 2. Release (`release.yml`)
**Purpose**: Automated release creation

**Features**:
- ✅ Creates GitHub releases from tags (`v*.*.*`)
- ✅ Generates changelog from git commits
- ✅ Builds all packages before release
- ✅ Can be triggered manually with version input

**Triggers**: 
- Push to tags matching `v*.*.*`
- Manual workflow dispatch

**Usage**:
```bash
# Create release tag
git tag v1.1.0
git push origin v1.1.0

# Or use manual workflow dispatch in GitHub UI
```

---

### 3. Dependency Review (`dependency-review.yml`)
**Purpose**: Review dependency changes in PRs

**Features**:
- ✅ Automatically reviews new/updated dependencies
- ✅ Fails on moderate+ severity vulnerabilities
- ✅ Blocks GPL-2.0 and GPL-3.0 licenses
- ✅ Only runs when package files change

**Triggers**: PRs that modify `package.json`, `pnpm-lock.yaml`, etc.

---

### 4. Dependabot Auto-merge (`dependabot-auto-merge.yml`)
**Purpose**: Automatically merge Dependabot PRs

**Features**:
- ✅ Auto-merges Dependabot PRs after CI passes
- ✅ Uses squash merge strategy
- ✅ Only runs for `dependabot[bot]` actor

**Note**: Requires Dependabot to be enabled (see `.github/dependabot.yml`)

---

### 5. Code Quality (`code-quality.yml`)
**Purpose**: Enforce code quality standards

**Checks**:
- ✅ Prettier formatting validation
- ✅ Conventional commit message format
- ✅ PR size check (warns if >300 LOC)

**Triggers**: `pull_request`, `push` to `main`

---

### 6. Docker Build (`docker-build.yml`)
**Purpose**: Build and push Docker images

**Features**:
- ✅ Matrix build for backend, realtime, admin
- ✅ Multi-platform builds (amd64, arm64)
- ✅ Pushes to GitHub Container Registry (ghcr.io)
- ✅ Build caching with GitHub Actions cache
- ✅ Only pushes on non-PR events

**Images**:
- `ghcr.io/killerlux/kouskous/backend`
- `ghcr.io/killerlux/kouskous/realtime`
- `ghcr.io/killerlux/kouskous/admin`

**Triggers**: 
- Push to `main` (apps changes)
- PRs (build only, no push)
- Manual dispatch

---

### 7. Stale (`stale.yml`)
**Purpose**: Automatically mark stale issues and PRs

**Features**:
- ✅ Marks issues stale after 60 days of inactivity
- ✅ Marks PRs stale after 30 days
- ✅ Closes stale issues after 14 more days
- ✅ Closes stale PRs after 7 more days
- ✅ Exempts pinned/security issues

**Triggers**: Daily cron (midnight UTC) or manual dispatch

---

## 🤖 Dependabot Configuration

**File**: `.github/dependabot.yml`

**Features**:
- ✅ Weekly updates for npm dependencies (Mondays 9 AM)
- ✅ Monthly updates for GitHub Actions
- ✅ Groups production and dev dependencies
- ✅ Limits open PRs to 10
- ✅ Uses conventional commit format

**Update Groups**:
- Production: NestJS, TypeORM, Socket.IO, Next.js, React
- Development: TypeScript, ESLint, Prettier, Jest

---

## 🔒 Security Features

1. **Trivy Scanning**: Scans for HIGH/CRITICAL vulnerabilities
2. **CodeQL Analysis**: Static analysis for security issues
3. **Dependency Review**: Blocks risky dependencies
4. **SARIF Upload**: Security findings visible in GitHub Security tab

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/killerlux/kouskous/workflows/CI/badge.svg)
![Security Scan](https://github.com/killerlux/kouskous/workflows/Security%20Scan/badge.svg)
![Docker Build](https://github.com/killerlux/kouskous/workflows/Docker%20Build/badge.svg)
```

---

## 🚀 Best Practices Implemented

1. ✅ **Explicit Permissions**: Minimal required permissions per workflow
2. ✅ **Concurrency Control**: Prevents duplicate workflow runs
3. ✅ **Dependency Caching**: Faster builds with pnpm cache
4. ✅ **Matrix Builds**: Parallel testing across apps
5. ✅ **Service Containers**: Postgres + PostGIS, Redis for testing
6. ✅ **Security Scanning**: Multiple layers (Trivy, CodeQL, Dependency Review)
7. ✅ **Automated Releases**: Tag-based release workflow
8. ✅ **Code Quality**: Formatting and commit message checks

---

## 📝 Required Secrets

No secrets required for basic workflows. For advanced features:

- `GITHUB_TOKEN`: Auto-provided, no setup needed
- Docker registry: Uses `GITHUB_TOKEN` for ghcr.io

---

## 🔧 Customization

### Adjust PR Size Limit
Edit `.github/workflows/code-quality.yml`:
```yaml
if [ "$ADDED" -gt 300 ]; then  # Change 300 to your limit
```

### Change Stale Timeouts
Edit `.github/workflows/stale.yml`:
```yaml
days-before-issue-stale: 60  # Adjust as needed
```

### Modify Dependabot Schedule
Edit `.github/dependabot.yml`:
```yaml
schedule:
  interval: "weekly"  # Options: daily, weekly, monthly
  day: "monday"
```

---

**Last Updated**: 2025-01-14

