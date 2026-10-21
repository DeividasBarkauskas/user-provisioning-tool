# User Provisioning Tool

A lightweight browser-based automation tool that parses a structured user-access request, extracts account information, validates required fields and generates standardized SQL for a user-provisioning workflow.

This repository is a **sanitized portfolio version** of an internal utility I created to make a repetitive support task faster and less error-prone.

## Why I built it

Creating a new user required taking information from a structured access request, transferring the values into the correct fields and preparing SQL for the provisioning process. Doing this manually was repetitive and created opportunities for copy/paste mistakes.

I created a small local browser tool to automate the repetitive part of the process while keeping the generated result visible for human review before execution.

## What it does

1. A structured access-request text is pasted into the tool.
2. JavaScript and regular expressions extract values such as name, email, employee number, login and workplace codes.
3. Parsed values are shown in editable fields so they can be reviewed or corrected manually.
4. Required fields are validated.
5. Additional workplace codes are parsed and duplicates are removed.
6. The tool generates a standardized SQL preview.
7. The SQL can be reviewed and copied for the next step of the workflow.

## Demo

Open `index.html` directly in a browser — no installation, server or dependencies are required.

A synthetic request is available in [`sample-request.txt`](./sample-request.txt).

## Technologies

- HTML
- CSS
- JavaScript
- Regular expressions (RegExp)
- SQL generation

## Design choice

The utility intentionally remains a small single-file application. It was designed as a quick internal productivity tool that can run locally in a browser without a build process or additional dependencies.

The browser application **does not connect to a database**. It only prepares a SQL preview that can be reviewed before any separate database operation.

## Portfolio / confidentiality note

The original utility was created for a real internal workflow. This public version has been generalized:

- company and system names are removed;
- database/table/column names are replaced with demo equivalents;
- all example data is synthetic;
- internal URLs and identifiers are removed;
- authentication/password-generation logic is intentionally excluded;
- the SQL is illustrative and is not intended to be executed against a real system.

The purpose of this repository is to demonstrate the automation approach and code structure without exposing internal implementation details.

## Related work

This project complements my [QA Engineer Portfolio](https://github.com/DeividasBarkauskas/qa-engineer-portfolio), where I document my hands-on QA mentoring and anonymized defect-validation/release workflow.
