# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-01

### Added
- Initial release in the `peviitor-scrapers` organization — derived from the [EPAM template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) (v1.5.2), replacing the earlier standalone scraper
- HTML scraping for REBELDOT SOLUTIONS S.R.L. (CIF 39271439) at https://careers.rebeldot.com/jobs (single page, all jobs)
- Workmode, locations and technology tags extracted from the job cards; tag keywords are matched on word boundaries
- City fallback rules (Cluj-Napoca, Brașov, Oradea, București) and default location `Cluj-Napoca` (RebelDot HQ)
- All template features inherited: `scraper/config/company.json` single source of truth, 7-day ANAF cache, `docs/jobs.md` generation, 4-layer test suite, daily scheduled scraping, GitHub Pages dashboard

## License

Copyright (c) 2026 BOGA SEBASTIAN-NICOLAE
