#!/bin/bash

# BeRides Test Suite Runner
# Run all tests for BeRides website

echo "🧪 BeRides Test Suite"
echo "===================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test files
TESTS=(
    "homepage.assure"
    "navigation.assure"
    "search.assure"
    "forms.assure"
    "booking.assure"
    "user-account.assure"
    "mobile-responsive.assure"
)

PASSED=0
FAILED=0

# Run each test
for test in "${TESTS[@]}"; do
    echo "Running: $test"
    if assure "berides-tests/$test"; then
        echo -e "${GREEN}✓ PASSED: $test${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED: $test${NC}"
        ((FAILED++))
    fi
    echo ""
done

# Summary
echo "===================="
echo "Summary:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi

