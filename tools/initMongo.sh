#!/usr/bin/env bash
mongoimport -d languist -c users --type csv --file data/users.csv --headerline
mongoimport -d languist -c languages --type csv --file data/languages.csv --headerline
mongoimport -d languist -c github_users --type csv --file data/github_users.csv --headerline
mongoimport -d languist -c github_repos --type csv --file data/github_repos.csv --headerline
