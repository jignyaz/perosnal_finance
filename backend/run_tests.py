"""
Enterprise Test Runner & Diagnostic Suite
Discovers and executes all test cases under tests/ with rich formatting, timing, and CI/CD exit codes.
Usage: python run_tests.py
"""

import os
import sys
import time
import inspect
import asyncio
import traceback
from typing import List, Tuple, Callable

# Ensure utf-8 output on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure backend root is in Python sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


def print_banner():
    print("=" * 70)
    print("  [TEST SUITE] PERSONAL FINANCE DASHBOARD - AUTOMATED TEST RUNNER")
    print("=" * 70)


def run_test_function(fn: Callable) -> Tuple[bool, float, str]:
    start = time.perf_counter()
    try:
        if inspect.iscoroutinefunction(fn):
            asyncio.run(fn())
        else:
            fn()
        elapsed = time.perf_counter() - start
        return True, elapsed, ""
    except Exception as e:
        elapsed = time.perf_counter() - start
        tb = traceback.format_exc()
        return False, elapsed, tb


def run_all_tests() -> int:
    print_banner()

    tests_dir = os.path.join(BACKEND_DIR, "tests")
    if not os.path.exists(tests_dir):
        print(f"Error: tests directory '{tests_dir}' not found.")
        return 1

    test_files = [f for f in sorted(os.listdir(tests_dir)) if f.startswith("test_") and f.endswith(".py")]

    total_passed = 0
    total_failed = 0
    start_total_time = time.perf_counter()

    for test_file in test_files:
        module_name = f"tests.{test_file[:-3]}"
        print(f"\n[MODULE] {module_name}")
        print("-" * 70)

        try:
            # Dynamic import of test module
            mod = __import__(module_name, fromlist=["*"])
        except Exception as e:
            print(f"  [ERROR] Failed to import module {module_name}: {e}")
            traceback.print_exc()
            total_failed += 1
            continue

        # Extract all functions starting with test_
        test_fns = [
            (name, getattr(mod, name))
            for name in dir(mod)
            if name.startswith("test_") and callable(getattr(mod, name))
        ]

        if not test_fns:
            print("  (No test functions found)")
            continue

        for name, fn in test_fns:
            passed, elapsed, err = run_test_function(fn)
            if passed:
                total_passed += 1
                print(f"  [PASS] {name:<45} ({elapsed*1000:6.1f}ms)")
            else:
                total_failed += 1
                print(f"  [FAIL] {name:<45} ({elapsed*1000:6.1f}ms)")
                print(f"\n  Traceback:\n{err}")

    total_time = time.perf_counter() - start_total_time

    print("\n" + "=" * 70)
    print("  [SUMMARY] TEST EXECUTION RESULTS")
    print("=" * 70)
    print(f"  Total Test Cases : {total_passed + total_failed}")
    print(f"  Passed           : {total_passed}")
    print(f"  Failed           : {total_failed}")
    print(f"  Total Duration   : {total_time:.2f} seconds")
    print("=" * 70)

    if total_failed == 0:
        print("  [SUCCESS] ALL TEST SUITES PASSED SUCCESSFULLY!")
        return 0
    else:
        print(f"  [FAILURE] {total_failed} TEST(S) FAILED.")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
