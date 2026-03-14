import argparse, json, random, time, requests

def mock_scan(target, tool):
    severity = random.choice(['high','medium','low'])
    return {
        "tool": tool,
        "severity": severity,
        "findings": [{"test": "sample", "evidence": f"Found issue on {target}"}],
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')
    }

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--target', required=True)
    p.add_argument('--tool', default='nmap')
    p.add_argument('--output')
    p.add_argument('--api-url')
    args = p.parse_args()
    result = mock_scan(args.target, args.tool)
    if args.output:
        with open(args.output, 'w') as f: json.dump(result, f, indent=2)
    if args.api_url:
        requests.post(f"{args.api_url}/api/scans", json=result)
    print(json.dumps(result, indent=2))
