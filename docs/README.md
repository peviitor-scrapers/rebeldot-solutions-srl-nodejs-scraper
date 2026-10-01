# job_seeker_ro_spider

**job_seeker_ro_spider** — scraper pentru job-urile REBELDOT SOLUTIONS S.R.L. din România.

Extrage anunțurile de pe [RebelDot Careers](https://careers.rebeldot.com/jobs) și le publică în [peviitor.ro](https://peviitor.ro) prin API-ul Peviitor.

> **🌱 Derived scraper.** Acest repo a fost derivat din [EPAM template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper). Identitatea companiei trăiește în `scraper/config/company.json`.

## Identificare

Toate request-urile HTTP folosesc User-Agent-ul:

```
job_seeker_ro_spider
```

## Ce face

1. **Validează compania** — interoghează API-ul public ANAF ([demoanaf.ro](https://demoanaf.ro)) după CIF-ul RebelDot (39271439) și verifică:
   - Denumirea oficială: REBELDOT SOLUTIONS S.R.L.
   - Status: activ/inactiv/radiat
   - Adresa completă din registrul comerțului
2. **Cross-validează cu Peviitor** — verifică existența companiei în API-ul Peviitor
3. **Scrape-uiește job-urile** — extrage lista de job-uri din pagina de cariere RebelDot (`/jobs`)
4. **Transformă datele** — normalizează locațiile (doar orașe românești), tag-urile (lowercase), workmode-ul (remote/on-site/hybrid)
5. **Stochează în Peviitor** — upsert prin API-ul Peviitor (job-uri și date companie)
6. **Generează jobs.md** — fișier markdown cu informații companie + toate job-urile curente

## API-uri folosite

| API | URL | Autentificare |
|---|---|---|
| RebelDot Careers | `https://careers.rebeldot.com/jobs` | Public (HTML) |
| ANAF (demoanaf) | `https://demoanaf.ro/api/...` | Public |
| Peviitor | `https://api.peviitor.ro/v1/company/` | Public |

## Robots.txt

RebelDot Careers [robots.txt](https://careers.rebeldot.com/robots.txt) permite căile folosite de scraper.

Scraper-ul face o singură cerere către `/jobs` și folosește un singur User-Agent identificabil. Paginile `/app/`, `/messages/` etc. nu sunt accesate.

Pentru analiza completă, vezi [ai/ROBOTS.md](../ai/ROBOTS.md).

## Testare

```bash
# Toate testele
npm test

# Doar unitare
npm run test:unit

# Doar integrare (necesită ANAF live, Peviitor API conditional)
npm run test:integration

# Doar E2E (site real RebelDot + ANAF + Peviitor)
npm run test:e2e
```

Testele Peviitor API folosesc `itIfApi` — se auto-skip dacă API-ul Peviitor nu e disponibil.
