# Dermotin — trajna uputstva za agente

## Domeni i produkcija — Nikola potvrdio 2026-09-06

- `dermotin.rs` je postojeći WordPress/WooCommerce sajt na našem serveru, NIJE na Vercelu. Planirana migracija nije nastavljena jer stari sajt bolje radi; on je ostao aktivan.
- `dermotin.com` i `dermotin.shop` vode na isti sajt na Vercelu. Ovaj repozitorijum (`C:/laragon/www/= ACTIVE =/dermotin`, GitHub `krlenix/dermotin`) je njegov source.
- Vercel zapis ili alias za `dermotin.rs` nije dokaz da se taj domen služi sa Vercela. Ne mešati WooCommerce produkciju sa ovim Next.js projektom.
- Rad na ovom repozitorijumu podrazumeva Vercel sajt za `.com` i `.shop`. Za rad na `.rs` treba koristiti zaseban WooCommerce kod i pristup našem serveru.

Za arhitekturu, komande i konvencije pročitaj `CLAUDE.md`.
