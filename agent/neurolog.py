import argparse
import json
import os
import platform
import subprocess
import sys
import urllib.error
import urllib.request


DEFAULT_API_URL = "https://neurolog-backend.onrender.com/api/triage"


def run_command(command):
    """
    Run the developer's command normally while collecting its output.
    """

    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    collected_output = []

    if process.stdout:
        for line in process.stdout:
            print(line, end="")
            collected_output.append(line)

    exit_code = process.wait()

    return exit_code, "".join(collected_output)


def build_failure_evidence(command, exit_code, output):
    """
    Build the runtime evidence NEUROLOG will investigate.
    """

    return f"""
NEUROLOG FAILURE EVENT

COMMAND:
{" ".join(command)}

EXIT CODE:
{exit_code}

WORKING DIRECTORY:
{os.getcwd()}

SYSTEM:
{platform.system()} {platform.release()}

PYTHON:
{platform.python_version()}

RUNTIME OUTPUT:
{output}
""".strip()


def request_diagnosis(evidence):
    """
    Send collected failure evidence to the existing NEUROLOG backend.
    """

    api_url = os.getenv("NEUROLOG_API_URL", DEFAULT_API_URL)

    payload = {
        "raw_log": evidence,
        "runtime_env": (
            f"{platform.system()} {platform.release()} | "
            f"Python {platform.python_version()}"
        ),
    }

    request = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return json.loads(response.read().decode("utf-8"))

    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8")
        raise RuntimeError(
            f"NEUROLOG API returned HTTP {error.code}: {body}"
        )

    except urllib.error.URLError as error:
        raise RuntimeError(
            f"Could not reach NEUROLOG engine: {error.reason}"
        )


def classify_failure(exit_code):
    """
    Classify whether developer intervention is required.

    A non-zero exit code means the command stopped unsuccessfully,
    therefore intervention is required.
    """

    if exit_code != 0:
        return "INTERVENE"

    return "REVIEW"


def print_diagnosis(diagnosis, exit_code):
    """
    Display the structured NEUROLOG diagnosis in the terminal.
    """

    classification = classify_failure(exit_code)

    print()
    print("=" * 64)
    print("NEUROLOG // DIAGNOSTIC REPORT")
    print("=" * 64)

    print()
    print(f"TRIAGE        {classification}")
    print(f"SEVERITY      {diagnosis.get('severity', 'UNKNOWN')}")
    print(f"CONFIDENCE    {diagnosis.get('confidence', 'UNKNOWN')}")

    print()
    print("WHAT BROKE")
    print("-" * 64)
    print(diagnosis.get("error_type", "Unknown failure"))
    print(diagnosis.get("error_message", ""))

    print()
    print("WHERE")
    print("-" * 64)

    isolated_file = diagnosis.get("isolated_file") or "Unknown"
    isolated_line = diagnosis.get("isolated_line")

    if isolated_line in (None, -1):
        isolated_line = "Unknown"

    print(f"{isolated_file}:{isolated_line}")

    print()
    print("WHY")
    print("-" * 64)
    print(
        diagnosis.get(
            "root_cause",
            "No root cause returned.",
        )
    )

    print()
    print("NEXT ACTION")
    print("-" * 64)

    steps = diagnosis.get("playbook_steps", [])

    if not steps:
        print("No playbook steps were returned.")

    for step in steps:
        print(
            f"{step.get('step_number', '-')}. "
            f"{step.get('title', '')}"
        )

        description = step.get("description")

        if description:
            print(f"   {description}")

        command = step.get("command")

        if command:
            print("   SUGGESTED COMMAND — REVIEW BEFORE RUNNING")
            print(f"   > {command}")

    print()
    print("NEUROLOG // FAILURE INVESTIGATION COMPLETE")
    print("=" * 64)


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Run a command under NEUROLOG failure diagnostics."
        )
    )

    parser.add_argument(
        "command",
        nargs=argparse.REMAINDER,
        help="Command to execute",
    )

    args = parser.parse_args()

    command = args.command

    if command and command[0] == "--":
        command = command[1:]

    if not command:
        parser.error(
            "Provide a command. Example: "
            "python3 agent/neurolog.py -- python3 app.py"
        )

    print()
    print("NEUROLOG // FAILURE WATCH ACTIVE")
    print(f"> {' '.join(command)}")
    print()

    try:
        exit_code, output = run_command(command)

    except FileNotFoundError:
        print(f"Command not found: {command[0]}")
        sys.exit(127)

    if exit_code == 0:
        print()
        print("NEUROLOG // EXECUTION COMPLETED")
        print("No failure detected.")
        sys.exit(0)

    print()
    print("!" * 64)
    print("FAILURE DETECTED")
    print("!" * 64)

    print()
    print("NEUROLOG // COLLECTING RUNTIME EVIDENCE")
    print("NEUROLOG // TRACING FAILURE")
    print("NEUROLOG // DIAGNOSING")

    evidence = build_failure_evidence(
        command,
        exit_code,
        output,
    )

    try:
        diagnosis = request_diagnosis(evidence)

    except RuntimeError as error:
        print()
        print("NEUROLOG // DIAGNOSTIC ENGINE ERROR")
        print(error)
        sys.exit(exit_code)

    print_diagnosis(diagnosis, exit_code)

    # Preserve the original program's failure exit status.
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
