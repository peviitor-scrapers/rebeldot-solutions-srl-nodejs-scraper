# Robots.txt Analysis — RebelDot Careers

Sursa: https://careers.rebeldot.com/robots.txt

## Reguli relevante

```
User-Agent: *
Disallow: /app/
Disallow: /messages/
Disallow: /messenger/
Disallow: /facebook/tab/
Disallow: /jobs/internal/
Content-Signal: search=yes, ai-train=no, ai-input=yes
```

(Un agent separat, `aihitdata`, este blocat complet — nu afectează `job_seeker_ro_spider`.)

## Interpretare

| Cale | Accesibil? | Ce conține |
|---|---|---|
| `/jobs` | ✅ Allowed | Lista tuturor job-urilor |
| `/jobs/<id>-<slug>` | ✅ Allowed | Pagina unui job (doar verificată cu HEAD în teste) |
| `/jobs/internal/` | ❌ Disallowed | Job-uri interne — nu sunt folosite |
| `/app/`, `/messages/` | ❌ Disallowed | Nu sunt folosite |

## Recomandare

Scraper-ul face o singură cerere GET către `/jobs` cu User-Agent `job_seeker_ro_spider`. `Content-Signal` interzice antrenarea de modele AI (`ai-train=no`); scraper-ul doar listează anunțuri în peviitor.ro, nu antrenează modele.

**Concluzie**: Risc minim — calea folosită este permisă.

## Diferență față de EPAM template

EPAM Careers dezactivează API-ul prin robots.txt; RebelDot permite `/jobs`, deci scraper-ul nu are această limitare.
