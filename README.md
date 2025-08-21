Misconfigured Cloud Scanner
WEBSITE LINK : https://vinayakiit.github.io/Misconfigured-Cloud-Scanner/

Misconfigured Cloud Scanner is a lightweight web-based tool that detects security risks in cloud storage services such as AWS S3, Azure Blob, and Google Cloud Storage.

Cloud storage misconfigurations are one of the most common causes of data breaches. This tool helps in identifying issues like public access, misconfigured permissions, and insecure bucket settings before attackers can exploit them.

🔍 What the Tool Does

Scans multiple cloud storage URLs at once

Automatically detects the provider (AWS / Azure / GCP)

Performs non-intrusive checks for misconfigurations

Displays results with severity levels and suggested actions

Exports findings in Table, JSON, or CSV formats

✨ Features

Public Read Access Detection → Identify buckets that allow anyone to read stored files

Public Write Access Detection → Catch buckets that allow anyone to upload/modify data

Directory Listing Check → Highlight buckets exposing file indexes

ACL Misconfigurations → Simulated checks for overly permissive access control lists

Multi-Cloud Support → Works with AWS, Azure, and GCP

Interactive Dashboard → User-friendly interface built with TailwindCSS

Report Export → Save scan results in multiple formats for audits or sharing

#Steps to Test with URLs

Open the tool in your browser.

In the “Scan Cloud Storage URLs” box, paste one or more URLs (one per line).
Example test URLs (public buckets):

AWS: http://s3.amazonaws.com/1000genomes

Azure: https://azureopendatastorage.blob.core.windows.net/isdweatherdatacontainer/

GCP: https://storage.googleapis.com/gcp-public-data-landsat/index.html

Select the scan options (Read, Write, Listing, Deep Analysis).

Click Start Scan.

View the results in Table, or switch to JSON/CSV output.

Use the Export Results button to save your scan report.


⚠️ Security Disclaimer

This tool is meant for educational and security auditing purposes only.
It only scans publicly accessible buckets and does not attempt to bypass authentication.
Use responsibly and in compliance with cloud provider policies.
