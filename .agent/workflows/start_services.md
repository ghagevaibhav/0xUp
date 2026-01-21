---
description: Infinite development
---



## Phase 1: Initialization (Run Once)

### 1.1 Load Context
- Read repository structure
- Identify:
  - Tech stack
  - Package managers
  - Build tools
  - Runtime requirements
  - Environment variables
  - Deployment target (cloud / VPS / serverless)

### 1.2 Define Success Criteria
Deployment is considered successful when:
- Application builds without errors
- All tests pass
- Security checks pass
- App is reachable via public URL OR deployment artifacts are ready

---

## Phase 2: Planning Phase (Runs Every Loop)

### 2.1 Generate Execution Plan
- Identify missing files
- Identify broken configs
- Identify incomplete features
- Identify deployment blockers

### 2.2 Prioritize Tasks
Order tasks by:
1. Build-breaking issues
2. Runtime errors
3. Security issues
4. Deployment gaps
5. Performance improvements

---

## Phase 3: Static Analysis Phase

### 3.1 Code Analysis
- Lint code
- Detect syntax errors
- Detect type errors
- Detect unused or broken imports

### 3.2 Dependency Analysis
- Verify lock files
- Detect missing dependencies
- Resolve version conflicts
- Remove deprecated packages

---

## Phase 4: Implementation Phase

### 4.1 Apply Fixes
- Modify code to fix detected issues
- Add missing configuration files
- Update environment templates
- Refactor unsafe or broken logic

### 4.2 Commit State (Logical)
- Track changes internally
- Maintain rollback safety

---

## Phase 5: Build Phase

### 5.1 Build Execution
- Run install commands
- Run build commands
- Capture logs

### 5.2 Build Failure Handling
IF build fails:
- Parse error logs
- Identify root cause
- Return to Phase 3 (Analysis)
- Continue loop

---

## Phase 6: Test Phase

### 6.1 Automated Testing
- Unit tests
- Integration tests
- API tests
- UI tests (if applicable)

### 6.2 Test Failure Handling
IF any test fails:
- Identify failing module
- Patch code
- Re-run tests
- Continue loop

---

## Phase 7: Runtime Validation Phase

### 7.1 Local Runtime Check
- Start application locally
- Verify startup logs
- Check health endpoints
- Simulate production environment

### 7.2 Failure Handling
IF runtime error occurs:
- Capture stack trace
- Fix root cause
- Restart runtime
- Continue loop

---

## Phase 8: Security & Quality Gate

### 8.1 Security Checks
- Secrets leakage detection
- Dependency vulnerability scan
- Unsafe API exposure
- Misconfigured headers

### 8.2 Quality Checks
- Performance baseline
- Memory usage
- Startup time
- Error rate

FAILURE → Fix → Loop again

---

## Phase 9: Deployment Preparation Phase

### 9.1 Deployment Artifact Generation
- Dockerfile
- docker-compose.yml OR
- Cloud deployment config
- Environment variable templates
- Production build artifacts

### 9.2 Infrastructure Validation
- Ports exposed correctly
- Health checks defined
- Logging configured
- Restart policies set

---

## Phase 10: Deployment Phase

### 10.1 Attempt Deployment
Depending on target:
- Cloud platform
- VPS
- Serverless
- Container registry

### 10.2 Deployment Failure Handling
IF deployment fails:
- Capture platform logs
- Fix configuration
- Retry deployment
- Continue loop

---

## Phase 11: Post-Deployment Verification

### 11.1 Internet Reachability Check
- Public URL reachable
- HTTPS working
- API endpoints responding
- No runtime crashes

### 11.2 Rollback Logic
IF verification fails:
- Rollback changes
- Fix issues
- Redeploy
- Continue loop

---

## Phase 12: Exit Conditions

The agent may exit ONLY when ALL conditions are met:
- Build successful
- Tests passing
- Security checks clean
- App reachable OR artifacts ready
- Deployment logs show success

### Final Output
- Deployment URL OR
- Production-ready artifacts
- Configuration summary
- Known limitations (if any)

---

## Infinite Mode Guarantee
If ANY phase fails:
- The agent MUST re-enter the loop
- The agent MUST attempt correction
- The agent MUST NOT terminate

---

## Termination Clause
The agent is explicitly forbidden from stopping unless:

deployment_status == SUCCESS


---

## End of Workflow
