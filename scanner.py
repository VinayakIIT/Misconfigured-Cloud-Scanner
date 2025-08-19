import random, datetime

def guess_provider(url: str) -> str:
    if "s3" in url or "amazonaws" in url:
        return "aws"
    elif "blob.core.windows.net" in url:
        return "azure"
    elif "storage.googleapis.com" in url:
        return "google"
    else:
        return "unknown"

def scan_urls(urls, options):
    results = []
    for url in urls:
        provider = guess_provider(url)
        findings = []
        status = "safe"

        # Random simulation logic
        if options.get("check_read") and random.random() > 0.7:
            findings.append({
                "type": "public_read",
                "severity": "critical",
                "message": "Bucket allows public read access"
            })
            status = "critical"

        if options.get("check_write") and random.random() > 0.8:
            findings.append({
                "type": "public_write",
                "severity": "critical",
                "message": "Bucket allows public write access"
            })
            status = "critical"

        if options.get("check_list") and random.random() > 0.6:
            findings.append({
                "type": "listable",
                "severity": "high",
                "message": "Bucket allows directory listing"
            })
            if status == "safe":
                status = "warning"

        if options.get("allow_write_test") and provider == "aws" and random.random() > 0.5:
            findings.append({
                "type": "acl_public_access",
                "severity": "high",
                "message": "S3 bucket ACL grants public access"
            })
            if status == "safe":
                status = "warning"

        results.append({
            "url": url,
            "provider": provider,
            "status": status,
            "findings": findings,
            "timestamp": datetime.datetime.utcnow().isoformat()
        })
    return results

