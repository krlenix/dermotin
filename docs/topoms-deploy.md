# Paralelno slanje u stari OMS i novi TopOMS

## Ispravka BIOROID seta i povratak integracije — 2. oktobar 2026.

Git objava `b3e29e0` od 23. septembra preuzela je samo verzionisane fajlove.
Integracija objavljena CLI-jem u septembru još je bila lokalna, pa su nestali
outbox, kratki brojevi, cron i slanje novom TopOMS-u. Integracija se sada čuva
u Git-u zajedno sa svojim rutama, migracijama, konfiguracijom i testovima.
Pre buduće objave proveriti da produkcione mogućnosti nisu samo u lokalnim fajlovima.

Vercel log od 2. oktobra u 12:40 (Europe/Belgrade) potvrdio je HTTP 500 za
`WEB-1790937649215-ilp7duecl`: `Product not found for SKU: BIOROID-SET`.
Legacy OMS zahteva fizičke SKU-ove `BIOROID` i `BIOROID-KAPI`. Set se sada
razlaže pre trajnog upisa legacy delivery payloada i u direktnom fallback slanju.
Raspodela u parama čuva ukupan iznos i popuste; retry ne menja sačuvane komponente.
BIOROID set od 1.990 RSD raspodeljuje se jednako: BIOROID 995 RSD i
BIOROID-KAPI 995 RSD, u oba OMS-a, nezavisno od pojedinačnih kataloških cena.

Supabase čuva dva BIOROID pokušaja posle te objave, sa podacima kupaca:
- `WEB-1790869926487-0bo8s4twu`: 1. oktobar 17:52, 4 seta, 7.960 RSD.
- `WEB-1790937649215-ilp7duecl`: 2. oktobar 12:40, 1 set, 2.390 RSD sa dostavom.
Read-only provera starog OMS-a po brand_order_id za brand 6 potvrđuje da oba
BIOROID ID-ja nedostaju; kontrolni FUNGEL ID postoji. Za prvi pokušaj nema
dostupnog Vercel loga sa uzrokom. Oba ID-ja vraćaju 404 i u novom TopOMS-u.

FUNGEL `WEB-1790965624998-dwzcekcfz` od 2. oktobra u 20:27 jeste uspešno
primljen u stari OMS (interni ID `33207`), ali ga nema u novom TopOMS-u.
Ove istorijske porudžbine nisu automatski ponovo poslate; pre oporavka proveriti
da nisu ručno obrađene i zadržati izvorne ID-jeve radi sprečavanja duplikata.

Regresioni testovi pokrivaju 1/3/4 seta, pun i delimičan popust, mešovitu korpu,
nepromenjen zbir, oba fizička SKU-a i HMAC potpis stvarnog izlaznog payloada.

## Produkcija — objavljeno 3. septembra 2026.

Lokalni projekat `C:\laragon\www\dermotin` je custom Next.js shop **dermotin.shop**.
Objavljen je na postojećem Vercel projektu `krlenixs-projects/dermotin`.
`dermotin.rs` je zaseban WordPress sajt na nasem serveru.
`dermotin.com` i `dermotin.shop` koriste ovaj Next.js projekat na Vercelu
(ispravka mapiranja koju je Nikola potvrdio 6. septembra).

## Odvojeni brend za dermotin.com (7. septembar 2026.)

`TOPOMS_COM_API_BASE_URL` i serverski `TOPOMS_COM_API_KEY` biraju novi store
`01m1xjsdr45d1hefx9tg1zzep5` za `dermotin.com` i `www.dermotin.com`.
Postojeci `TOPOMS_API_*` ostaju namenjeni `.shop` brendu. Globalni enabled,
dry-run i locale uslovi vaze za oba. Pull URL za novi brend je
`https://dermotin.com/api/topoms` i prihvata samo novi kljuc.
Porudzbine, katalog, statusi i retry poslovi koriste sopstveni store_id;
cron obradjuje oba store-a. Interni status/sync/replay endpoint bira store
prema domenu zahteva. Katalog iz admina sinhronizuje oba brenda.
Objavljeno i provereno na javnim domenima:
- `.shop` production: `dpl_2b86hdvXA4jQECmXjmDxN3ZrdwEz`.
- `.com` ostaje u postojecem `nopixel` okruzenju:
  `dpl_Br71CYM7aEr5qjBMNJx3td44UKw5`. Sacuvana su podesavanja pracenja tog okruzenja.
- Oba okruzenja imaju serverske TopOMS konfiguracije i zajednicki Supabase outbox;
  cron u production deploymentu obradjuje oba store-a.
- Novi store je aktivan. Read-back potvrdjuje 8 proizvoda / 8 varijanti.
- Javni ping, pull sa limit=200, status i naslovne strane vracaju HTTP 200;
  kljuc drugog brenda vraca 401. COM live sync ne pravi duplikate.
- U trenutku provere: COM 8 delivered, SHOP 30 delivered; ostala stanja 0.
- 44 testa, TypeScript, ciljani ESLint i oba Vercel builda prolaze.
  Poslat je samo sinteticki `test:true` probe, bez stvarne test kupovine.

Za SHOP koristiti `vercel deploy --prod --skip-domain`, pa eksplicitni `.shop` alias.
Za COM koristiti `vercel deploy --target nopixel`. Ovaj target automatski vezuje
i `dermotinshop.com`; kada promena vazi samo za `.com`, vratiti taj dodatni alias
na njegov prethodni deployment. CLI ne podrzava `--skip-domain` za custom target.
Ne menjati `.rs` DNS ili alias.

## Istorijski SHOP deployment od 3. septembra

- Produkcioni URL: `https://dermotin.shop`.
- Deployment kratkih brojeva: `dpl_4JKqiB81wZQGSLvdGNLavWNJuwEL`.
  Prethodni `dpl_2JytoFR4ZP8STq6xowXArACf7LDR` uveo je Pull `limit=200`,
  obavezna shipping tax polja i kompatibilni legacy order ID.
- Pull base URL: `https://dermotin.shop/api/topoms`.
- Production environment: TopOMS uključen, dry-run isključen, serverski ključevi
  postavljeni kao Vercel secrets. Postojeći legacy webhook URL i tajne nisu menjani.
- TopOMS ping: `accepting_deliveries=true`; katalog uvezen i proveren kroz read-back:
  **8 proizvoda / 8 varijanti**, bez nedostajućih ID-jeva.
- Outbox posle sinhronizacije: 8 delivered product poslova; pending/retry/blocked = 0.
- Vercel Cron: `/api/internal/oms/cron`, jednom u minuti, vezan za ovaj deployment,
  autentikovan zasebnim `CRON_SECRET`; produkcioni invocation potvrđen u Vercel logu sa HTTP 200.
- Provere: 42 testa, TypeScript, ciljani ESLint i production build prolaze.
  Javni shop HTTP 200; autorizovani Pull ping/count/proizvodi rade; bez ključa HTTP 401.
  Proverena paginacija i URL-ovi slika na dermotin.shop. Nije napravljena stvarna test kupovina.

Ispravka nakon prvog deploya: TopOMS `SyncStoreProducts` traži `limit=200`, dok je
početna implementacija pogrešno ograničavala SHOP Pull na 100 i vraćala HTTP 400.
Limit je sada 1–200. Regresioni testovi pokrivaju pravi zahtev sa oba auth headera,
delta filter i paginaciju 200 + 5; produkcioni zahtev `products?limit=200` je proveren.

Deployment je napravljen pomoću `vercel deploy --prod --skip-domain`, a zatim je
`vercel alias set <deployment-url> dermotin.shop` povezao samo traženi domen.
Za sledeći deploy sačuvaj ovaj opseg; ne menjaj WP domene niti DNS.
Izmene izvornog koda još su lokalne/necommitovane: deploy ih je preuzeo direktno,
ne preko novog Git commita. Sačuvaj ih u repozitorijumu pre narednog Git-triggered deploya.

Kupovina od 3. septembra u 18:43 po lokalnom vremenu bila je odbijena zbog
nedostajućih `shipping.tax` / `shipping.is_taxable` u novom OMS-u i predugačkog
legacy ID-ja (44 umesto najviše 40 znakova). U 18:52 obnovljena su samo njena
dva sačuvana delivery posla; iznosi, stavke i izvorni shop ID nisu menjani.
Stari OMS vratio je potvrdu za internu porudžbinu `32526`, a novi OMS read-back
vraća sačuvanu porudžbinu sa statusom `new`. Ovo nije nova test kupovina.
Tri odvojene dijagnostičke isporuke imale su `test:true` i sintetičke podatke,
pa ne postaju stvarne magacinske porudžbine.
Lokalni `.env.local` namerno ostaje `TOPOMS_ENABLED=false` / `WEBHOOK_DRY_RUN=true`;
produkcione vrednosti su odvojene na Vercelu.

Migracija kratkih brojeva `20260903_checkout_order_numbers.sql` izvršena je u istom
Supabase projektu. SQL provera pod `service_role` potvrdila je numerički format,
isti broj na retry-u, različite brojeve za različite kupovine i očuvanje prethodnog ID-ja.
Svi testni zapisi vraćeni su rollback-om; broj reservation zapisa posle provere je 0,
a postojećih delivery zapisa 10 (svi delivered). Test nije napravio porudžbinu niti
poslao webhook. RLS je uključen; anon/authenticated ne mogu čitati rezervacije ni
pozivati RPC. Sekvenca je potrošila dva testna broja, što je očekivano i bezbedno.

## Istorija pripreme (pre deploya)

Provera 3. septembra 2026: dati ključ je ispravan, naziv prodavnice je `Dermotin`, ali
`accepting_deliveries=false`. Nisu poslati proizvodi niti stvarne porudžbine.
**Aktiviraj prodavnicu u TopOMS-u pre sinhronizacije.** Prazan HTTP 200 nije dokaz prijema.
Lokalni `.env.local` sadrži novi ključ, ali ostaje `TOPOMS_ENABLED=false` i
`WEBHOOK_DRY_RUN=true` radi bezbednog lokalnog rada. Taj fajl je git-ignored.

Supabase priprema je završena 3. septembra 2026. na projektu **DERMOTIN**
(`obarfilhvxbkejrwothi`, organizacija TOPOMS): postojeći `service_role` ključ dodat je
u lokalni `.env.local`, a migracija `20260903_oms_deliveries.sql` izvršena je u bazi.
Provereno: tabela je prazna, worker funkcija vraća 0 poslova, RLS je uključen,
`anon` i `authenticated` nemaju pristup tabeli ni funkciji. Broj postojećih porudžbina
pre i posle migracije bio je 2.728. Ključ još treba preneti u environment produkcionog
hostinga pri deployu (završeno, vidi produkcioni status iznad); lokalna konfiguracija nije automatski hosting konfiguracija.
Završni preflight prolazi Supabase provere, ali staje jer je TopOMS store i dalje neaktivan.

Posle toga je 3. septembra 2026. poslat jedan eksplicitni connection probe
(`test-1788452111746`, `test:true`), bez podataka kupca. Endpoint je vratio prazan
uspešan odgovor; naknadni ping je i dalje imao `accepting_deliveries=false`.
Potrebno je završiti čarobnjak povezivanja u TopOMS-u. Ovo nije produkciona porudžbina.

## Deploy redosled

Ako TopOMS čarobnjak za povezivanje čeka **prvi webhook**, pokreni
`npm run topoms:connect`. Ova izričita komanda šalje samo sintetički `test:true`
probe i sme da se izvrši pre aktivacije (i dok je lokalni dry-run uključen).
Ne šalje kupca, katalog ili stvarnu porudžbinu. Završi povezivanje u TopOMS-u,
pa proveri `accepting_deliveries=true`. Prazan odgovor na probe nije dokaz aktivacije.
Produkcioni worker i dalje nikada ne šalje stvarne podatke neaktivnoj prodavnici.

1. U postojećem Supabase projektu izvrši `supabase/migrations/20260903_oms_deliveries.sql`.
   Migracija dodaje zasebnu tabelu i funkciju za zaključavanje poslova. Ne menja postojeće
   porudžbine. Tabela nije dostupna `anon`/`authenticated` ulozi, samo `service_role`.
   Zatim izvrši `supabase/migrations/20260903_checkout_order_numbers.sql` pre deploya
   kratkih brojeva. Dodaje zasebnu sekvencu, trajne rezervacije i service-role RPC;
   ne menja brojeve već primljenih porudžbina. `tests/order-number.sql` proverava
   dodelu, ponavljanje zahteva, stari ID i dozvole u transakciji sa rollback-om.
2. U hosting environment dodaj vrednosti iz `deploy/topoms.env.example`. Novi API ključ je
   onaj dostavljen za ovaj TopOMS store; **ne menjaj postojeće `RS_ORDER_*`, `BA_ORDER_*`
   i stare webhook URL-ove**. `SUPABASE_SERVICE_ROLE_KEY` uzmi iz istog Supabase projekta.
   `SUPABASE_ANON_KEY` nije dovoljan. Tajne nikada ne stavljaj u javne promenljive ili git.
   Generisanje worker tajne: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Ova konfiguracija šalje **samo RS/RSD** porudžbine sa eksplicitno navedenih domena u
   novi store. BA/ME nastavljaju stari tok. Ukloni iz liste domene koji ne pripadaju ovom
   store-u. Za drugo tržište potreban je odgovarajući zasebni store i ključ.
4. Postavi `TOPOMS_CATALOG_UPDATED_AT` na stvarni datum/vreme poslednje izmene kataloga
   sa vremenskom zonom. Menjaj ga samo kada se menja katalog. Nikada ga ne generiši
   ponovo prilikom retry-a. Admin snimanje automatski dobija novi timestamp.
5. `npm ci`, `npm run test:topoms`, `npx tsc --noEmit`, `npm run build`.
   Pokreni Node hosting sa `npm start` (ili postojeći Next.js hosting). Za worker rutu
   potreban je runtime limit 120 sekundi. Sam build ne aktivira produkcioni deployment.
6. Na Vercelu `vercel.json` zakazuje **GET `/api/internal/oms/cron` jednom u minuti**,
   i dok nema poseta sajtu. U Production secrets dodaj zaseban `CRON_SECRET` (32+ znakova).
   Vercel automatski šalje `Authorization: Bearer CRON_SECRET`; bez njega ruta vraća 401.
   Potreban je plan koji podržava minutni raspored (postojeći projekat koristi Pro).
   Za drugi hosting ili ručni prolaz koristi `POST https://dermotin.shop/api/internal/oms`, header
   `Authorization: Bearer OMS_WORKER_SECRET`, `Content-Type: application/json`, telo
   `{"action":"drain"}`. U scheduleru čuvaj tajnu kao secret. Primer za Node/VPS:
   `* * * * * cd /putanja/do/dermotin && /usr/bin/node scripts/topoms.cjs drain`.
   Cron ima zasebnu GET rutu; običan GET `/api/internal/oms` ostaje read-only status.
7. U produkcionom okruženju: `npm run topoms:check`, zatim `npm run topoms:rehearsal`.
   Rehearsal šalje samo `test:true` i ne formira stvarnu porudžbinu za magacin.
8. `npm run topoms:sync`; proveri `npm run topoms:status` i TopOMS → Synchronization →
   Incoming webhooks. Sačekaj da katalog bude uvezen. Worker proverava da varijante
   postoje u TopOMS feedu pre slanja porudžbine (202 je samo prihvatanje u red).
9. Tek tada pusti checkout. Na prvoj **stvarnoj kupovini** proveri porudžbinu u oba OMS-a,
   količine, popust, dostavu i iznos pouzeća. Ne praviti lažnu proizvodnu porudžbinu.

## Kako radi

Za obuhvaćene porudžbine jedna atomska operacija trajno upisuje dva nezavisna delivery
posla i potrebne katalog snapshotove u Supabase. Tek tada kupac dobija uspeh. `queued`
znači da je porudžbina trajno primljena u shop, ne da je OMS završio import. CAPI se
pokreće nakon tog upisa. Drugi zahtev sa istim checkout event ID-jem ne šalje ponovo CAPI.
Nove porudžbine na `dermotin.shop` / `www.dermotin.shop` dobijaju kratak numerički
broj bez prefiksa, npr. `100001`. Sekvenca počinje od 100001; brojevi mogu imati rupe
posle neuspešnih/odustalih zahteva ili provera i nisu fiskalni brojevi ni kurirski tracking.
Jedinstvena sekvenca sprečava kolizije između kupovina, a transakciono zaključavanje
i trajna rezervacija po hash-u domena i checkout event ID-ja čuvaju isti broj na retry-u.
Isti string se šalje kao legacy `order_id` i TopOMS `id` / `number`, te vraća kupcu.
Za zahteve bez event ID-ja kreira se sveža rezervacija; sve aktuelne checkout forme
šalju stabilan event ID. Ako dodela nije dostupna, nema slanja ni CAPI Purchase-a.
Numerisanje shopa ne zavisi od uključivanja novog OMS-a; drugi domeni ostaju nepromenjeni.

Legacy body i autentikacija ostaju isti; dodati su timeout, trajni retry i stabilan order ID.
Kompatibilnost prethodnih porudžbina: postojeći `WEB-...` ID se ne preimenuje,
čak ni pri ponovljenom checkout zahtevu posle deploya. Stari OMS prihvata najviše 40 znakova. Duži shop ID se samo
na legacy transportu deterministički mapira na `WEB-` + 36 hex znakova SHA-256.
Izvorni ID ostaje u trajnom snapshotu; retry i status update dobijaju isti legacy ID.
Ako Supabase outbox nije dostupan, zahtev se odbija pre slanja bilo kom OMS-u.

Worker radi odmah nakon odgovora gde hosting podržava Next `after`, a scheduler je
garancija nastavka posle restarta, timeouta ili perioda bez poseta. Zaključavanje je u
Postgresu (`FOR UPDATE SKIP LOCKED`), ne u memoriji. Neuspeh jednog odredišta ne sprečava
drugo. Retry čuva isti payload i event ID, uz minimum 60 s i eksponencijalno čekanje do
jednog sata. HTTP 400/401/403/413/422 i neaktivna prodavnica ostaju `blocked` dok operater
ne reši uzrok. HTTP 429/5xx, timeouti i čekanje na import kataloga ostaju `retry`.

Stari OMS mora i dalje da deduplikuje po `order_id`: kod mrežnog timeouta nije moguće
znati da li je udaljeni server već upisao porudžbinu. Novi TopOMS dobija stabilan
`X-Event-Id`, `id`, ISO timestamp, eksplicitno pouzeće, decimalne iznose i SKU/variant ID.
Shop prodaje samo pouzećem; ne tvrdi se da je izvršena kartična naplata.
Checkout ne obračunava porez odvojeno: uz `shipping.price` šalje obavezne
`tax: "0.00"`, `is_taxable: false`, `tax_rate: null`, kao eksplicitni
unconfigured-tax slučaj iz TopOMS ugovora. Ne izmišlja PDV stopu niti menja bruto dostavu.
HTTP 422 poruke u outboxu zadržavaju samo nazive neispravnih polja, nikada telo
odgovora ili lične podatke. TopOMS može skratiti arhivu odbijenog tela na 1 KB:
„neispravan JSON“ u tom prikazu nije dokaz da je originalni zahtev imao lošu sintaksu.

## Katalog, paketi i izmene

- Više prodajnih paketa deli isti fizički SKU. TopOMS dobija jedan proizvod i po jednu
  fizičku varijantu po SKU-u; 2/3 pakovanja se šalju kao 2/3 komada, ne kao novo stanje
  zaliha. Korpa šalje i izvorne product/variant ID-jeve radi tačnog razlaganja.
- BIOROID SET se razlaže na kremu i kapi; komercijalni iznos i popust raspoređuju se
  proporcionalno. Svi iznosi se računaju u parama. Razlika deljenja sa 3 raspoređuje se
  kao line discount, bez menjanja ukupne cene. Isti mapping pokriva 1+1 i gratis stavke.
- Svaki product push sadrži pun skup fizičkih varijanti. Ne šalje se `inventory_quantity`
  niti se prepisuju postojeća TopOMS podešavanja upravljanja zalihama.
- Admin kreiranje/izmena/brisanje proizvoda zakazuje snapshot; obrisani proizvodi se
  arhiviraju, ne brišu fizički u OMS-u. Posle ručnih izmena kataloga i rebuilda pokreni
  `topoms:sync` sa novim timestampom. Ručno uklonjen proizvod treba prethodno arhivirati
  kroz admin. Admin panela koji piše TS fajlove nema na read-only/serverless fajl sistemu;
  ta postojeća arhitektura nije promenjena ovom integracijom.
- Admin `updateStatus` propagira pending/paid/cancelled za porudžbine nastale ovom
  integracijom. Stare porudžbine se ne backfilluju bez izričitog zahteva. Delimična
  plaćanja/refundacije nisu podržane bez eksplicitnih iznosa. Ukoliko upis statusa uspe,
  a zakazivanje ne uspe, API vraća jasno upozorenje i zahtev treba ponoviti.

## Operacije i oporavak

- `npm run topoms:status`: brojevi poslova i aktivnost store-a, bez podataka kupaca.
- `npm run topoms:drain`: jedan ograničeni worker prolaz.
- `npm run topoms:replay`: eksplicitno pokretanje blokiranih poslova nakon rešavanja
  autentikacije/aktivacije. Ne rešava neispravan payload; njega prvo popraviti i ponoviti
  sa istim event ID-jem, prema TopOMS ugovoru. Delivered poslovi se ne resetuju.
- Za read-back statusa/trackinga: zaštićen `GET /api/internal/oms?orderId=100001` sa
  istim worker bearer tokenom. Čitati `tracking[].courier_status`, ne label lifecycle.
  Nema javnog endpointa za PII niti automatskog menjanja korisničkog UI-ja prema pollingu.
- Postavi hosting/scheduler alarm za neuspešne pozive, `blocked > 0` i rast/starost
  pending/retry reda. Payload je lični podatak: ograniči Supabase pristup, uključi backup
  i retention prema svojim pravilima; neuspele poslove ne brisati dok nisu rešeni.
- Rollback prijema: `TOPOMS_ENABLED=false` vraća nove kupovine na stari tok. Scheduler
  nastavlja ranije trajno primljene poslove. Za potpuno zaustavljanje worker-a isključi
  scheduler i postavi `WEBHOOK_DRY_RUN=true`, ali to isključuje i živi checkout webhook.

## Pull API za dugme „Sinhronizuj proizvode“

Posle deploya ovih ruta, u TopOMS polje **Osnovni URL pull API-ja** unesi:
`https://dermotin.shop/api/topoms`.
Ovaj custom shop se objavljuje na **Vercelu**, na domenu **dermotin.shop**, ne dermotin.rs.
Ne dodavati `/products` ili `/ping` u osnovni URL; TopOMS ih sam dopisuje.
Lokalni kod nije automatski objavljen na javnom domenu — pre snimanja URL-a potreban je deploy
i `TOPOMS_API_KEY`/`TOPOMS_CATALOG_UPDATED_AT` u hosting environmentu.

- `GET /api/topoms/ping` → `{"ok":true}`.
- `GET /api/topoms/products/count?updated_since=` → `{"count":8}` za trenutni katalog.
- `GET /api/topoms/products?updated_since=&cursor=&limit=` → `products`, `next_cursor`,
  `has_next_page`, sa istim punim product/variant payloadom kao push.

Autentikacija koristi isti store ključ iz `TOPOMS_API_KEY`, u `X-API-Key` i/ili
`Authorization: Bearer ...` headeru. Ako su poslata oba, oba moraju odgovarati.
Ključ ne ide u URL. Bez ispravne autentikacije vraća se 401; odgovori se ne keširaju.
Read-only rute rade i kada je push isključen ili je lokalni `WEBHOOK_DRY_RUN=true`.
`limit` je 1–200 (podrazumevano 50); TopOMS `SyncStoreProducts` šalje `limit=200`.
Ne mešati ovo sa TopOMS-ovim sopstvenim read feedom, koji ima maksimum 100.
`updated_since` je ISO-8601 sa zonom, uključujući
granični timestamp. Potpisani cursor sadrži i filter: može se proslediti sam u sledećem
zahtevu. Ako se katalog promeni usred paginacije, 409 traži novi prolaz bez starog cursora.

TopOMS uvozi 8 fizičkih proizvoda/varijanti; prodajni paketi dele isti SKU, a BIOROID SET
se u porudžbinama razlaže na fizičke komponente. Feed zato namerno nije 9 prodajnih kartica.
Postojeći `/api/products-sync` ostaje neizmenjen za stari sistem. Pull porudžbina nije
uključen; nemoj uključivati istorijski order import za ovaj URL. Nove porudžbine idu push putem.
