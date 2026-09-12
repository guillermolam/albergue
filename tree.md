# File Tree: albergue

**Generated:** 12/09/2026, 19:39:33
**Root Path:** `/Users/guillermolammartin/Git/guillermolam/albergue`

```
├── 📁 .github
│   ├── 📁 agents
│   │   └── 📝 astro-frontend-dev.agent.md
│   ├── 📁 chatmodes
│   │   └── 📝 beastmode.chatmode.md
│   ├── 📁 instructions
│   │   └── 📝 aikido_rules.instructions.md
│   ├── 📁 workflows
│   │   ├── ⚙️ ci.yml
│   │   └── ⚙️ nightly.yml
│   ├── 📄 CODEOWNERS
│   └── ⚙️ dependabot.yml
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 commands
│   │   │   ├── 📄 audit_log.ts
│   │   │   ├── 📄 beds.ts
│   │   │   ├── 📄 bookings.ts
│   │   │   ├── 📄 government_submissions.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 notifications.ts
│   │   │   ├── 📄 payments.ts
│   │   │   ├── 📄 pilgrims.ts
│   │   │   ├── 📄 pricing.ts
│   │   │   └── 📄 users.ts
│   │   ├── 📁 lib
│   │   │   ├── 📄 db.ts
│   │   │   ├── 📄 errors.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 middleware.ts
│   │   ├── 📁 queries
│   │   │   ├── 📄 audit_log.ts
│   │   │   ├── 📄 beds.ts
│   │   │   ├── 📄 bookings.ts
│   │   │   ├── 📄 government_submissions.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 notifications.ts
│   │   │   ├── 📄 payments.ts
│   │   │   ├── 📄 pilgrims.ts
│   │   │   ├── 📄 pricing.ts
│   │   │   └── 📄 users.ts
│   │   ├── 📁 routes
│   │   │   ├── 📄 audit_log.ts
│   │   │   ├── 📄 beds.ts
│   │   │   ├── 📄 bookings.ts
│   │   │   ├── 📄 government_submissions.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 notifications.ts
│   │   │   ├── 📄 payments.ts
│   │   │   ├── 📄 pilgrims.ts
│   │   │   ├── 📄 pricing.ts
│   │   │   └── 📄 users.ts
│   │   ├── 📁 tests
│   │   │   ├── 📄 resiliency.test.ts
│   │   │   └── 📄 setup.ts
│   │   ├── 📁 types
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   ├── 📄 drizzle.config.ts
│   ├── ⚙️ package.json
│   ├── ⚙️ tsconfig.json
│   └── 📄 vitest.config.ts
├── 📁 domain_model
│   ├── 📁 migrations
│   │   ├── 📁 meta
│   │   │   ├── ⚙️ 0000_snapshot.json
│   │   │   └── ⚙️ _journal.json
│   │   ├── 📄 0000_flaky_norrin_radd.sql
│   │   ├── 📄 001_init_schema.sql
│   │   ├── 📄 002_add_notifications.sql
│   │   ├── 📄 003_add_audit_log.sql
│   │   ├── 📄 004_add_indexes.sql
│   │   └── 📄 005_seed_pricing.sql
│   ├── 📁 rust
│   │   ├── 📁 crates
│   │   │   ├── 📁 domain
│   │   │   │   ├── 📁 src
│   │   │   │   │   ├── 🦀 booking.rs
│   │   │   │   │   ├── 🦀 identity.rs
│   │   │   │   │   ├── 🦀 lib.rs
│   │   │   │   │   └── 🦀 money.rs
│   │   │   │   └── ⚙️ Cargo.toml
│   │   │   ├── 📁 migration
│   │   │   │   ├── 📁 src
│   │   │   │   │   ├── 🦀 lib.rs
│   │   │   │   │   ├── 🦀 m20260111_000001_users.rs
│   │   │   │   │   ├── 🦀 m20260111_000002_pilgrims.rs
│   │   │   │   │   ├── 🦀 m20260111_000003_beds.rs
│   │   │   │   │   ├── 🦀 m20260111_000004_bookings.rs
│   │   │   │   │   ├── 🦀 m20260111_000005_payments.rs
│   │   │   │   │   ├── 🦀 m20260111_000006_pricing.rs
│   │   │   │   │   ├── 🦀 m20260111_000007_government_submissions.rs
│   │   │   │   │   ├── 🦀 m20260111_000008_notifications.rs
│   │   │   │   │   ├── 🦀 m20260111_000009_audit_log.rs
│   │   │   │   │   ├── 🦀 m20260111_000010_seed_synthetic_data.rs
│   │   │   │   │   └── 🦀 main.rs
│   │   │   │   ├── 📁 tests
│   │   │   │   │   └── 🦀 migrations_smoke.rs
│   │   │   │   └── ⚙️ Cargo.toml
│   │   │   ├── 📁 persistence
│   │   │   │   ├── 📁 src
│   │   │   │   │   ├── 📁 entities
│   │   │   │   │   │   ├── 🦀 audit_log.rs
│   │   │   │   │   │   ├── 🦀 beds.rs
│   │   │   │   │   │   ├── 🦀 bookings.rs
│   │   │   │   │   │   ├── 🦀 government_submissions.rs
│   │   │   │   │   │   ├── 🦀 mod.rs
│   │   │   │   │   │   ├── 🦀 notifications.rs
│   │   │   │   │   │   ├── 🦀 payments.rs
│   │   │   │   │   │   ├── 🦀 pilgrims.rs
│   │   │   │   │   │   ├── 🦀 pricing.rs
│   │   │   │   │   │   └── 🦀 users.rs
│   │   │   │   │   ├── 🦀 db.rs
│   │   │   │   │   └── 🦀 lib.rs
│   │   │   │   └── ⚙️ Cargo.toml
│   │   │   ├── 📁 seaography
│   │   │   │   ├── 📁 src
│   │   │   │   │   └── 🦀 main.rs
│   │   │   │   └── ⚙️ Cargo.toml
│   │   │   └── 📁 turso-sync
│   │   │       ├── 📁 sql
│   │   │       │   └── 📄 baseline_libsql.sql
│   │   │       ├── 📁 src
│   │   │       │   └── 🦀 main.rs
│   │   │       └── ⚙️ Cargo.toml
│   │   ├── ⚙️ Cargo.toml
│   │   └── 📄 Justfile
│   ├── 📁 schemas
│   │   ├── 📄 postgres.sql
│   │   └── 📄 sqlite.sql
│   ├── 📁 scripts
│   │   ├── 📄 dump-schema-postgres.sh
│   │   ├── 📄 dump-schema-sqlite.sh
│   │   ├── 📄 migrate-postgres.sh
│   │   ├── 📄 migrate-sqlite.sh
│   │   ├── 📄 setup-db.sh
│   │   ├── 📄 setup-neon.sh
│   │   └── 📄 turso-migrate-smoke.sh
│   ├── 📁 seed
│   │   ├── 📄 dev_seed.sql
│   │   └── 📄 test_seed.sql
│   ├── 📁 src
│   │   ├── 📁 commands
│   │   │   ├── 📄 beds.ts
│   │   │   ├── 📄 bookings.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 pilgrims.ts
│   │   ├── 📁 lib
│   │   │   ├── 📄 db.ts
│   │   │   └── 📄 errors.ts
│   │   ├── 📁 queries
│   │   │   ├── 📄 beds.ts
│   │   │   ├── 📄 bookings.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 pilgrims.ts
│   │   └── 📄 index.ts
│   ├── 📁 test
│   │   ├── 📄 db-integration.test.sql
│   │   ├── 📄 migration-check.test.sql
│   │   └── 📄 rollback-test.sql
│   ├── 📝 README.md
│   ├── 📄 drizzle.config.ts
│   ├── 📄 neon-config.sql
│   ├── ⚙️ package.json
│   ├── 📄 schema.ts
│   └── ⚙️ tsconfig.json
├── 📁 frontend
│   ├── 📁 .husky
│   │   ├── 📄 commit-msg
│   │   ├── 📄 pre-commit
│   │   └── 📄 pre-push
│   ├── 📁 migrations
│   │   ├── ⚙️ .gitkeep
│   │   └── 📄 001_pilgrim_schema.sql
│   ├── 📁 public
│   │   ├── 📁 figma
│   │   │   └── 📄 Doodle icons.fig
│   │   ├── 📁 glb
│   │   │   ├── 📄 bellota.glb
│   │   │   └── 📄 cerdo.glb
│   │   ├── 📁 logos
│   │   │   ├── 🖼️ logo-dark.png
│   │   │   ├── 🖼️ logo.webp
│   │   │   ├── 🖼️ logoalbergue-removebg-preview.png
│   │   │   ├── 🖼️ logoalbergue.webp
│   │   │   └── 🖼️ logoalbergue__msi___jpeg-432w.webp
│   │   ├── 📁 mp4
│   │   ├── 📁 png
│   │   │   ├── 📁 arrows
│   │   │   │   ├── 🖼️ arrow-circle-down.png
│   │   │   │   ├── 🖼️ arrow-circle-left.png
│   │   │   │   ├── 🖼️ arrow-circle-right.png
│   │   │   │   ├── 🖼️ arrow-circle-up.png
│   │   │   │   ├── 🖼️ arrow-down.png
│   │   │   │   ├── 🖼️ arrow-left.png
│   │   │   │   ├── 🖼️ arrow-ne.png
│   │   │   │   ├── 🖼️ arrow-nw.png
│   │   │   │   ├── 🖼️ arrow-right.png
│   │   │   │   ├── 🖼️ arrow-se.png
│   │   │   │   ├── 🖼️ arrow-single-down.png
│   │   │   │   ├── 🖼️ arrow-single-left.png
│   │   │   │   ├── 🖼️ arrow-single-right.png
│   │   │   │   ├── 🖼️ arrow-single-up.png
│   │   │   │   ├── 🖼️ arrow-square-down.png
│   │   │   │   ├── 🖼️ arrow-square-left.png
│   │   │   │   ├── 🖼️ arrow-square-right.png
│   │   │   │   ├── 🖼️ arrow-square-up.png
│   │   │   │   ├── 🖼️ arrow-sw.png
│   │   │   │   ├── 🖼️ arrow-up.png
│   │   │   │   ├── 🖼️ chevrons-down.png
│   │   │   │   ├── 🖼️ chevrons-left.png
│   │   │   │   ├── 🖼️ chevrons-right.png
│   │   │   │   └── 🖼️ chevrons-up.png
│   │   │   ├── 📁 currency
│   │   │   │   ├── 🖼️ dollar.png
│   │   │   │   ├── 🖼️ euro.png
│   │   │   │   ├── 🖼️ franc.png
│   │   │   │   ├── 🖼️ pound.png
│   │   │   │   ├── 🖼️ ruble.png
│   │   │   │   ├── 🖼️ rupee.png
│   │   │   │   ├── 🖼️ won.png
│   │   │   │   └── 🖼️ yen.png
│   │   │   ├── 📁 e-commerce
│   │   │   │   ├── 🖼️ bag-2.png
│   │   │   │   ├── 🖼️ bag.png
│   │   │   │   ├── 🖼️ basket.png
│   │   │   │   ├── 🖼️ box-2.png
│   │   │   │   ├── 🖼️ box.png
│   │   │   │   ├── 🖼️ card-2.png
│   │   │   │   ├── 🖼️ card-3.png
│   │   │   │   ├── 🖼️ card.png
│   │   │   │   ├── 🖼️ cart-add.png
│   │   │   │   ├── 🖼️ cart-delete.png
│   │   │   │   ├── 🖼️ cart-remove.png
│   │   │   │   ├── 🖼️ conveyor-belt.png
│   │   │   │   ├── 🖼️ factory.png
│   │   │   │   ├── 🖼️ hand-truck.png
│   │   │   │   ├── 🖼️ location.png
│   │   │   │   ├── 🖼️ offer.png
│   │   │   │   ├── 🖼️ qr.png
│   │   │   │   ├── 🖼️ sale.png
│   │   │   │   ├── 🖼️ shop.png
│   │   │   │   ├── 🖼️ shopping-cart-2.png
│   │   │   │   ├── 🖼️ shopping-cart-3.png
│   │   │   │   ├── 🖼️ shopping-cart.png
│   │   │   │   ├── 🖼️ tag-2.png
│   │   │   │   ├── 🖼️ tag.png
│   │   │   │   ├── 🖼️ truck.png
│   │   │   │   ├── 🖼️ unbox.png
│   │   │   │   └── 🖼️ warehouse.png
│   │   │   ├── 📁 emojis
│   │   │   │   ├── 🖼️ confused-emoji.png
│   │   │   │   ├── 🖼️ cool-emoji.png
│   │   │   │   ├── 🖼️ crying-emoji.png
│   │   │   │   ├── 🖼️ grinning-squinting-emoji.png
│   │   │   │   ├── 🖼️ happy-emoji.png
│   │   │   │   ├── 🖼️ heart-eyes-emoji.png
│   │   │   │   ├── 🖼️ laugh-emoji.png
│   │   │   │   ├── 🖼️ sad-emoji.png
│   │   │   │   ├── 🖼️ shocked-emoji.png
│   │   │   │   ├── 🖼️ smiling-emoji.png
│   │   │   │   ├── 🖼️ smiling-with-eyes-emoji.png
│   │   │   │   ├── 🖼️ surprised-emoji.png
│   │   │   │   ├── 🖼️ wink-emoji.png
│   │   │   │   └── 🖼️ worried-emoji.png
│   │   │   ├── 📁 files
│   │   │   │   ├── 🖼️ file-attachment.png
│   │   │   │   ├── 🖼️ file-audio.png
│   │   │   │   ├── 🖼️ file-code.png
│   │   │   │   ├── 🖼️ file-contract.png
│   │   │   │   ├── 🖼️ file-csv.png
│   │   │   │   ├── 🖼️ file-figma.png
│   │   │   │   ├── 🖼️ file-form.png
│   │   │   │   ├── 🖼️ file-image-2.png
│   │   │   │   ├── 🖼️ file-image.png
│   │   │   │   ├── 🖼️ file-invoice.png
│   │   │   │   ├── 🖼️ file-jpg.png
│   │   │   │   ├── 🖼️ file-list.png
│   │   │   │   ├── 🖼️ file-mov.png
│   │   │   │   ├── 🖼️ file-mp4.png
│   │   │   │   ├── 🖼️ file-notes.png
│   │   │   │   ├── 🖼️ file-pdf.png
│   │   │   │   ├── 🖼️ file-png.png
│   │   │   │   ├── 🖼️ file-spreadsheet.png
│   │   │   │   ├── 🖼️ file-svg.png
│   │   │   │   ├── 🖼️ file-text.png
│   │   │   │   ├── 🖼️ file-vector.png
│   │   │   │   ├── 🖼️ file-zip.png
│   │   │   │   ├── 🖼️ file.png
│   │   │   │   └── 🖼️ png.png
│   │   │   ├── 📁 finance
│   │   │   │   ├── 🖼️ bank.png
│   │   │   │   ├── 🖼️ bill.png
│   │   │   │   ├── 🖼️ cash.png
│   │   │   │   ├── 🖼️ coin-2.png
│   │   │   │   ├── 🖼️ coin.png
│   │   │   │   ├── 🖼️ dollar.png
│   │   │   │   ├── 🖼️ money-plant.png
│   │   │   │   ├── 🖼️ piggy-bank.png
│   │   │   │   ├── 🖼️ safe.png
│   │   │   │   ├── 🖼️ saving.png
│   │   │   │   ├── 🖼️ trend-down-square.png
│   │   │   │   ├── 🖼️ trend-down.png
│   │   │   │   ├── 🖼️ trend-up-square.png
│   │   │   │   ├── 🖼️ trend-up.png
│   │   │   │   └── 🖼️ wallet.png
│   │   │   ├── 📁 food
│   │   │   │   ├── 🖼️ burger.png
│   │   │   │   ├── 🖼️ cake.png
│   │   │   │   ├── 🖼️ candy.png
│   │   │   │   ├── 🖼️ cutlery.png
│   │   │   │   ├── 🖼️ dish.png
│   │   │   │   ├── 🖼️ drink.png
│   │   │   │   ├── 🖼️ egg.png
│   │   │   │   ├── 🖼️ fork.png
│   │   │   │   ├── 🖼️ ice-cream.png
│   │   │   │   ├── 🖼️ pizza-2.png
│   │   │   │   ├── 🖼️ pizza.png
│   │   │   │   ├── 🖼️ popsicle.png
│   │   │   │   ├── 🖼️ spoon.png
│   │   │   │   └── 🖼️ water.png
│   │   │   ├── 📁 gender symbols
│   │   │   │   ├── 🖼️ bisexual.png
│   │   │   │   ├── 🖼️ femaile.png
│   │   │   │   ├── 🖼️ gay.png
│   │   │   │   ├── 🖼️ genderless.png
│   │   │   │   ├── 🖼️ hetro.png
│   │   │   │   ├── 🖼️ intersex.png
│   │   │   │   ├── 🖼️ lesbian.png
│   │   │   │   ├── 🖼️ male.png
│   │   │   │   ├── 🖼️ non-binary-transgender.png
│   │   │   │   ├── 🖼️ other-gender.png
│   │   │   │   ├── 🖼️ transgender-2.png
│   │   │   │   └── 🖼️ transgender.png
│   │   │   ├── 📁 hand gestures
│   │   │   │   ├── 🖼️ 2-double-tap.png
│   │   │   │   ├── 🖼️ 2-scroll-left.png
│   │   │   │   ├── 🖼️ 2-scroll-right.png
│   │   │   │   ├── 🖼️ 2-scroll-up-1.png
│   │   │   │   ├── 🖼️ 2-scroll-up.png
│   │   │   │   ├── 🖼️ 2-tap-1.png
│   │   │   │   ├── 🖼️ 2-tap.png
│   │   │   │   ├── 🖼️ 2-touch-hold.png
│   │   │   │   ├── 🖼️ 3-scroll-down.png
│   │   │   │   ├── 🖼️ 3-scroll-up.png
│   │   │   │   ├── 🖼️ 3-tap-scroll.png
│   │   │   │   ├── 🖼️ 3-tap.png
│   │   │   │   ├── 🖼️ clap.png
│   │   │   │   ├── 🖼️ double-tap.png
│   │   │   │   ├── 🖼️ folded-hands.png
│   │   │   │   ├── 🖼️ free-drag.png
│   │   │   │   ├── 🖼️ hand.png
│   │   │   │   ├── 🖼️ horizontal-scroll.png
│   │   │   │   ├── 🖼️ multi-touch.png
│   │   │   │   ├── 🖼️ ok.png
│   │   │   │   ├── 🖼️ page-move.png
│   │   │   │   ├── 🖼️ point-down.png
│   │   │   │   ├── 🖼️ point-left.png
│   │   │   │   ├── 🖼️ point-right.png
│   │   │   │   ├── 🖼️ point-up.png
│   │   │   │   ├── 🖼️ rotate.png
│   │   │   │   ├── 🖼️ scan-fingerprint.png
│   │   │   │   ├── 🖼️ scan.png
│   │   │   │   ├── 🖼️ screen-rotate.png
│   │   │   │   ├── 🖼️ scroll-down.png
│   │   │   │   ├── 🖼️ scroll-left-1.png
│   │   │   │   ├── 🖼️ scroll-left.png
│   │   │   │   ├── 🖼️ scroll-up.png
│   │   │   │   ├── 🖼️ swipe-left.png
│   │   │   │   ├── 🖼️ swipe-right.png
│   │   │   │   ├── 🖼️ tap-1.png
│   │   │   │   ├── 🖼️ tap.png
│   │   │   │   ├── 🖼️ thumbs-down.png
│   │   │   │   ├── 🖼️ thumbs-up.png
│   │   │   │   ├── 🖼️ touch-hold.png
│   │   │   │   ├── 🖼️ v.png
│   │   │   │   ├── 🖼️ vibrate.png
│   │   │   │   ├── 🖼️ wave-left.png
│   │   │   │   ├── 🖼️ wave-right.png
│   │   │   │   ├── 🖼️ zoom-in.png
│   │   │   │   └── 🖼️ zoom-out.png
│   │   │   ├── 📁 health
│   │   │   │   ├── 🖼️ blood-bag.png
│   │   │   │   ├── 🖼️ blood.png
│   │   │   │   ├── 🖼️ bottle.png
│   │   │   │   ├── 🖼️ dropper.png
│   │   │   │   ├── 🖼️ first-aid.png
│   │   │   │   ├── 🖼️ firstaid-2.png
│   │   │   │   ├── 🖼️ flask-round.png
│   │   │   │   ├── 🖼️ flask.png
│   │   │   │   ├── 🖼️ heart-beat.png
│   │   │   │   ├── 🖼️ injection.png
│   │   │   │   ├── 🖼️ lungs.png
│   │   │   │   ├── 🖼️ medical-logo.png
│   │   │   │   ├── 🖼️ microscope.png
│   │   │   │   ├── 🖼️ pills.png
│   │   │   │   ├── 🖼️ stethoscope.png
│   │   │   │   ├── 🖼️ tablet.png
│   │   │   │   ├── 🖼️ test-tube.png
│   │   │   │   ├── 🖼️ tooth.png
│   │   │   │   └── 🖼️ wheelchair.png
│   │   │   ├── 📁 interface
│   │   │   │   ├── 🖼️ Info.png
│   │   │   │   ├── 🖼️ analytics.png
│   │   │   │   ├── 🖼️ arrow-down.png
│   │   │   │   ├── 🖼️ arrow-up.png
│   │   │   │   ├── 🖼️ arrow.png
│   │   │   │   ├── 🖼️ at-the-rate.png
│   │   │   │   ├── 🖼️ backward.png
│   │   │   │   ├── 🖼️ bell-2.png
│   │   │   │   ├── 🖼️ bell.png
│   │   │   │   ├── 🖼️ bluetooth.png
│   │   │   │   ├── 🖼️ bookmark.png
│   │   │   │   ├── 🖼️ bulb.png
│   │   │   │   ├── 🖼️ calculator.png
│   │   │   │   ├── 🖼️ calendar.png
│   │   │   │   ├── 🖼️ call.png
│   │   │   │   ├── 🖼️ camera.png
│   │   │   │   ├── 🖼️ caution.png
│   │   │   │   ├── 🖼️ center-align-2.png
│   │   │   │   ├── 🖼️ center-align.png
│   │   │   │   ├── 🖼️ checklist.png
│   │   │   │   ├── 🖼️ clock.png
│   │   │   │   ├── 🖼️ cloud-down.png
│   │   │   │   ├── 🖼️ cloud-up.png
│   │   │   │   ├── 🖼️ cloud.png
│   │   │   │   ├── 🖼️ cookie.png
│   │   │   │   ├── 🖼️ copy.png
│   │   │   │   ├── 🖼️ crop.png
│   │   │   │   ├── 🖼️ cross.png
│   │   │   │   ├── 🖼️ cut.png
│   │   │   │   ├── 🖼️ dashboard-2.png
│   │   │   │   ├── 🖼️ dashboard-3.png
│   │   │   │   ├── 🖼️ dashboard-4.png
│   │   │   │   ├── 🖼️ dashboard.png
│   │   │   │   ├── 🖼️ delete.png
│   │   │   │   ├── 🖼️ diamond.png
│   │   │   │   ├── 🖼️ doc-add.png
│   │   │   │   ├── 🖼️ doc-remove.png
│   │   │   │   ├── 🖼️ doc.png
│   │   │   │   ├── 🖼️ download.png
│   │   │   │   ├── 🖼️ drawer.png
│   │   │   │   ├── 🖼️ eject.png
│   │   │   │   ├── 🖼️ eraser.png
│   │   │   │   ├── 🖼️ fast-forward.png
│   │   │   │   ├── 🖼️ fast-rewind.png
│   │   │   │   ├── 🖼️ filter.png
│   │   │   │   ├── 🖼️ flag-2.png
│   │   │   │   ├── 🖼️ flag.png
│   │   │   │   ├── 🖼️ flip.png
│   │   │   │   ├── 🖼️ floppy.png
│   │   │   │   ├── 🖼️ folder-add.png
│   │   │   │   ├── 🖼️ folder-delete.png
│   │   │   │   ├── 🖼️ folder-empty.png
│   │   │   │   ├── 🖼️ folder-remove.png
│   │   │   │   ├── 🖼️ folder.png
│   │   │   │   ├── 🖼️ forward.png
│   │   │   │   ├── 🖼️ gift.png
│   │   │   │   ├── 🖼️ globe.png
│   │   │   │   ├── 🖼️ grid-2.png
│   │   │   │   ├── 🖼️ grid.png
│   │   │   │   ├── 🖼️ headphone.png
│   │   │   │   ├── 🖼️ heart.png
│   │   │   │   ├── 🖼️ hide.png
│   │   │   │   ├── 🖼️ home-1.png
│   │   │   │   ├── 🖼️ home.png
│   │   │   │   ├── 🖼️ key.png
│   │   │   │   ├── 🖼️ layer.png
│   │   │   │   ├── 🖼️ left-align-2.png
│   │   │   │   ├── 🖼️ left-align.png
│   │   │   │   ├── 🖼️ link.png
│   │   │   │   ├── 🖼️ list.png
│   │   │   │   ├── 🖼️ location-pin.png
│   │   │   │   ├── 🖼️ lock.png
│   │   │   │   ├── 🖼️ login.png
│   │   │   │   ├── 🖼️ logout.png
│   │   │   │   ├── 🖼️ magic-wand.png
│   │   │   │   ├── 🖼️ mail-gift.png
│   │   │   │   ├── 🖼️ mail-open.png
│   │   │   │   ├── 🖼️ mail-surprise.png
│   │   │   │   ├── 🖼️ mail.png
│   │   │   │   ├── 🖼️ map.png
│   │   │   │   ├── 🖼️ maximize.png
│   │   │   │   ├── 🖼️ megaphone.png
│   │   │   │   ├── 🖼️ menu-2.png
│   │   │   │   ├── 🖼️ menu.png
│   │   │   │   ├── 🖼️ message-2.png
│   │   │   │   ├── 🖼️ message.png
│   │   │   │   ├── 🖼️ mic-2.png
│   │   │   │   ├── 🖼️ mic.png
│   │   │   │   ├── 🖼️ minimize.png
│   │   │   │   ├── 🖼️ move.png
│   │   │   │   ├── 🖼️ music-2.png
│   │   │   │   ├── 🖼️ music-3.png
│   │   │   │   ├── 🖼️ music.png
│   │   │   │   ├── 🖼️ mute.png
│   │   │   │   ├── 🖼️ navigation-2.png
│   │   │   │   ├── 🖼️ navigation.png
│   │   │   │   ├── 🖼️ note.png
│   │   │   │   ├── 🖼️ paint-bucket.png
│   │   │   │   ├── 🖼️ paper-clip-2.png
│   │   │   │   ├── 🖼️ paper-clip.png
│   │   │   │   ├── 🖼️ paste.png
│   │   │   │   ├── 🖼️ pause.png
│   │   │   │   ├── 🖼️ pen-tool.png
│   │   │   │   ├── 🖼️ pen.png
│   │   │   │   ├── 🖼️ pencil-2.png
│   │   │   │   ├── 🖼️ pencil-3.png
│   │   │   │   ├── 🖼️ pencil-ruler.png
│   │   │   │   ├── 🖼️ pencil.png
│   │   │   │   ├── 🖼️ phone-setting.png
│   │   │   │   ├── 🖼️ phone.png
│   │   │   │   ├── 🖼️ photo.png
│   │   │   │   ├── 🖼️ pie.png
│   │   │   │   ├── 🖼️ pin.png
│   │   │   │   ├── 🖼️ play.png
│   │   │   │   ├── 🖼️ puzzle-2.png
│   │   │   │   ├── 🖼️ puzzle.png
│   │   │   │   ├── 🖼️ question-2.png
│   │   │   │   ├── 🖼️ question.png
│   │   │   │   ├── 🖼️ record.png
│   │   │   │   ├── 🖼️ rectangle.png
│   │   │   │   ├── 🖼️ right-align-2.png
│   │   │   │   ├── 🖼️ right-align.png
│   │   │   │   ├── 🖼️ rss.png
│   │   │   │   ├── 🖼️ ruler.png
│   │   │   │   ├── 🖼️ scan.png
│   │   │   │   ├── 🖼️ search.png
│   │   │   │   ├── 🖼️ send-2.png
│   │   │   │   ├── 🖼️ send-3.png
│   │   │   │   ├── 🖼️ send.png
│   │   │   │   ├── 🖼️ server.png
│   │   │   │   ├── 🖼️ setting-2.png
│   │   │   │   ├── 🖼️ setting-3.png
│   │   │   │   ├── 🖼️ setting.png
│   │   │   │   ├── 🖼️ shape.png
│   │   │   │   ├── 🖼️ shield-2.png
│   │   │   │   ├── 🖼️ shield.png
│   │   │   │   ├── 🖼️ shuffle.png
│   │   │   │   ├── 🖼️ signal.png
│   │   │   │   ├── 🖼️ speaker.png
│   │   │   │   ├── 🖼️ square.png
│   │   │   │   ├── 🖼️ star.png
│   │   │   │   ├── 🖼️ stopwatch.png
│   │   │   │   ├── 🖼️ suitcase.png
│   │   │   │   ├── 🖼️ sun-2.png
│   │   │   │   ├── 🖼️ sun-3.png
│   │   │   │   ├── 🖼️ sun-4.png
│   │   │   │   ├── 🖼️ sun.png
│   │   │   │   ├── 🖼️ switch-1.png
│   │   │   │   ├── 🖼️ switch.png
│   │   │   │   ├── 🖼️ sync.png
│   │   │   │   ├── 🖼️ tablet.png
│   │   │   │   ├── 🖼️ target-2.png
│   │   │   │   ├── 🖼️ target.png
│   │   │   │   ├── 🖼️ thumbs-up.png
│   │   │   │   ├── 🖼️ tick-2.png
│   │   │   │   ├── 🖼️ tick.png
│   │   │   │   ├── 🖼️ transform.png
│   │   │   │   ├── 🖼️ tree-2.png
│   │   │   │   ├── 🖼️ tree.png
│   │   │   │   ├── 🖼️ trophy.png
│   │   │   │   ├── 🖼️ unhide.png
│   │   │   │   ├── 🖼️ unlink.png
│   │   │   │   ├── 🖼️ upload.png
│   │   │   │   ├── 🖼️ user-add.png
│   │   │   │   ├── 🖼️ user-caution.png
│   │   │   │   ├── 🖼️ user-delete.png
│   │   │   │   ├── 🖼️ user-female.png
│   │   │   │   ├── 🖼️ user-male.png
│   │   │   │   ├── 🖼️ user-remove.png
│   │   │   │   ├── 🖼️ user.png
│   │   │   │   ├── 🖼️ video-camera.png
│   │   │   │   ├── 🖼️ volume-down.png
│   │   │   │   ├── 🖼️ volume-up.png
│   │   │   │   ├── 🖼️ zap.png
│   │   │   │   ├── 🖼️ zoom-in.png
│   │   │   │   ├── 🖼️ zoom-out-1.png
│   │   │   │   └── 🖼️ zoom-out.png
│   │   │   ├── 📁 logos
│   │   │   │   ├── 🖼️ apple.png
│   │   │   │   ├── 🖼️ behance.png
│   │   │   │   ├── 🖼️ codepen.png
│   │   │   │   ├── 🖼️ dribbble.png
│   │   │   │   ├── 🖼️ dropbox.png
│   │   │   │   ├── 🖼️ facebook-2.png
│   │   │   │   ├── 🖼️ facebook.png
│   │   │   │   ├── 🖼️ fb-messenger.png
│   │   │   │   ├── 🖼️ google.png
│   │   │   │   ├── 🖼️ instagram.png
│   │   │   │   ├── 🖼️ linkedin.png
│   │   │   │   ├── 🖼️ paypal.png
│   │   │   │   ├── 🖼️ pinterest.png
│   │   │   │   ├── 🖼️ product hunt.png
│   │   │   │   ├── 🖼️ skype.png
│   │   │   │   ├── 🖼️ snapchat.png
│   │   │   │   ├── 🖼️ spotify.png
│   │   │   │   ├── 🖼️ tik tok.png
│   │   │   │   ├── 🖼️ tumblr.png
│   │   │   │   ├── 🖼️ twitch.png
│   │   │   │   ├── 🖼️ twitter.png
│   │   │   │   ├── 🖼️ uber.png
│   │   │   │   ├── 🖼️ webflow.png
│   │   │   │   ├── 🖼️ whatsapp.png
│   │   │   │   ├── 🖼️ windows.png
│   │   │   │   ├── 🖼️ y-combinator.png
│   │   │   │   └── 🖼️ youtube.png
│   │   │   ├── 📁 misc
│   │   │   │   ├── 🖼️ automation.png
│   │   │   │   ├── 🖼️ bot.png
│   │   │   │   ├── 🖼️ bug.png
│   │   │   │   ├── 🖼️ bus.png
│   │   │   │   ├── 🖼️ car.png
│   │   │   │   ├── 🖼️ chip.png
│   │   │   │   ├── 🖼️ coffee-cup-1.png
│   │   │   │   ├── 🖼️ coffee-cup-2.png
│   │   │   │   ├── 🖼️ fire.png
│   │   │   │   ├── 🖼️ hot-air-balloon.png
│   │   │   │   ├── 🖼️ plane.png
│   │   │   │   ├── 🖼️ rocket.png
│   │   │   │   ├── 🖼️ satellite.png
│   │   │   │   ├── 🖼️ server.png
│   │   │   │   ├── 🖼️ ship.png
│   │   │   │   └── 🖼️ trophy.png
│   │   │   ├── 📁 objects
│   │   │   │   ├── 🖼️ anchor.png
│   │   │   │   ├── 🖼️ balloon-2.png
│   │   │   │   ├── 🖼️ balloon.png
│   │   │   │   ├── 🖼️ camera.png
│   │   │   │   ├── 🖼️ crown.png
│   │   │   │   ├── 🖼️ flashlight.png
│   │   │   │   ├── 🖼️ frame.png
│   │   │   │   ├── 🖼️ guitar.png
│   │   │   │   ├── 🖼️ movie-clapper.png
│   │   │   │   ├── 🖼️ paint-brush-2.png
│   │   │   │   ├── 🖼️ paint-brush.png
│   │   │   │   ├── 🖼️ paint-bucket.png
│   │   │   │   ├── 🖼️ paint-roller.png
│   │   │   │   ├── 🖼️ sofa.png
│   │   │   │   └── 🖼️ tv.png
│   │   │   ├── 📁 weather
│   │   │   │   ├── 🖼️ Vector.png
│   │   │   │   ├── 🖼️ cloudy-day.png
│   │   │   │   ├── 🖼️ cloudy-night.png
│   │   │   │   ├── 🖼️ night.png
│   │   │   │   ├── 🖼️ rain-heavy.png
│   │   │   │   ├── 🖼️ rain-light.png
│   │   │   │   ├── 🖼️ snow.png
│   │   │   │   ├── 🖼️ snowflake.png
│   │   │   │   ├── 🖼️ snowman.png
│   │   │   │   ├── 🖼️ sunny.png
│   │   │   │   ├── 🖼️ thunderstorm.png
│   │   │   │   ├── 🖼️ tornado.png
│   │   │   │   └── 🖼️ wind.png
│   │   │   ├── 🖼️ acorn-outline-vector-set-handdrawn-600nw-2596698629.webp
│   │   │   ├── 🖼️ doodlesec.png
│   │   │   ├── 🖼️ doodlesec3.png
│   │   │   ├── 🖼️ hand-drawn-acorn-doodle-cute-cartoon-style-vector-free-natureinspired-sketch-illustrations_1167562-18136.jpg
│   │   │   ├── 🖼️ iberico-cerda-de-raza-isométrica-ilustración-vectorial-vectores-ícono-isométrico-cerdo-señal-símbolo-aislado-308359617.jpg
│   │   │   └── 🖼️ image.png
│   │   ├── 📁 svg
│   │   │   ├── 📁 arrows
│   │   │   │   ├── 🖼️ arrow-circle-down.svg
│   │   │   │   ├── 🖼️ arrow-circle-left.svg
│   │   │   │   ├── 🖼️ arrow-circle-right.svg
│   │   │   │   ├── 🖼️ arrow-circle-up.svg
│   │   │   │   ├── 🖼️ arrow-down.svg
│   │   │   │   ├── 🖼️ arrow-left.svg
│   │   │   │   ├── 🖼️ arrow-ne.svg
│   │   │   │   ├── 🖼️ arrow-nw.svg
│   │   │   │   ├── 🖼️ arrow-right.svg
│   │   │   │   ├── 🖼️ arrow-se.svg
│   │   │   │   ├── 🖼️ arrow-single-down.svg
│   │   │   │   ├── 🖼️ arrow-single-left.svg
│   │   │   │   ├── 🖼️ arrow-single-right.svg
│   │   │   │   ├── 🖼️ arrow-single-up.svg
│   │   │   │   ├── 🖼️ arrow-square-down.svg
│   │   │   │   ├── 🖼️ arrow-square-left.svg
│   │   │   │   ├── 🖼️ arrow-square-right.svg
│   │   │   │   ├── 🖼️ arrow-square-up.svg
│   │   │   │   ├── 🖼️ arrow-sw.svg
│   │   │   │   ├── 🖼️ arrow-up.svg
│   │   │   │   ├── 🖼️ chevrons-down.svg
│   │   │   │   ├── 🖼️ chevrons-left.svg
│   │   │   │   ├── 🖼️ chevrons-right.svg
│   │   │   │   └── 🖼️ chevrons-up.svg
│   │   │   ├── 📁 currency
│   │   │   │   ├── 🖼️ dollar.svg
│   │   │   │   ├── 🖼️ euro.svg
│   │   │   │   ├── 🖼️ franc.svg
│   │   │   │   ├── 🖼️ pound.svg
│   │   │   │   ├── 🖼️ ruble.svg
│   │   │   │   ├── 🖼️ rupee.svg
│   │   │   │   ├── 🖼️ won.svg
│   │   │   │   └── 🖼️ yen.svg
│   │   │   ├── 📁 e-commerce
│   │   │   │   ├── 🖼️ bag-2.svg
│   │   │   │   ├── 🖼️ bag.svg
│   │   │   │   ├── 🖼️ basket.svg
│   │   │   │   ├── 🖼️ box-2.svg
│   │   │   │   ├── 🖼️ box.svg
│   │   │   │   ├── 🖼️ card-2.svg
│   │   │   │   ├── 🖼️ card-3.svg
│   │   │   │   ├── 🖼️ card.svg
│   │   │   │   ├── 🖼️ cart-add.svg
│   │   │   │   ├── 🖼️ cart-delete.svg
│   │   │   │   ├── 🖼️ cart-remove.svg
│   │   │   │   ├── 🖼️ conveyor-belt.svg
│   │   │   │   ├── 🖼️ factory.svg
│   │   │   │   ├── 🖼️ hand-truck.svg
│   │   │   │   ├── 🖼️ location.svg
│   │   │   │   ├── 🖼️ offer.svg
│   │   │   │   ├── 🖼️ qr.svg
│   │   │   │   ├── 🖼️ sale.svg
│   │   │   │   ├── 🖼️ shop.svg
│   │   │   │   ├── 🖼️ shopping-cart-2.svg
│   │   │   │   ├── 🖼️ shopping-cart-3.svg
│   │   │   │   ├── 🖼️ shopping-cart.svg
│   │   │   │   ├── 🖼️ tag-2.svg
│   │   │   │   ├── 🖼️ tag.svg
│   │   │   │   ├── 🖼️ truck.svg
│   │   │   │   ├── 🖼️ unbox.svg
│   │   │   │   └── 🖼️ warehouse.svg
│   │   │   ├── 📁 emojis
│   │   │   │   ├── 🖼️ confused-emoji.svg
│   │   │   │   ├── 🖼️ cool-emoji.svg
│   │   │   │   ├── 🖼️ crying-emoji.svg
│   │   │   │   ├── 🖼️ grinning-squinting-emoji.svg
│   │   │   │   ├── 🖼️ happy-emoji.svg
│   │   │   │   ├── 🖼️ heart-eyes-emoji.svg
│   │   │   │   ├── 🖼️ laugh-emoji.svg
│   │   │   │   ├── 🖼️ sad-emoji.svg
│   │   │   │   ├── 🖼️ shocked-emoji.svg
│   │   │   │   ├── 🖼️ smiling-emoji.svg
│   │   │   │   ├── 🖼️ smiling-with-eyes-emoji.svg
│   │   │   │   ├── 🖼️ surprised-emoji.svg
│   │   │   │   ├── 🖼️ wink-emoji.svg
│   │   │   │   └── 🖼️ worried-emoji.svg
│   │   │   ├── 📁 files
│   │   │   │   ├── 🖼️ file-attachment.svg
│   │   │   │   ├── 🖼️ file-audio.svg
│   │   │   │   ├── 🖼️ file-code.svg
│   │   │   │   ├── 🖼️ file-contract.svg
│   │   │   │   ├── 🖼️ file-csv.svg
│   │   │   │   ├── 🖼️ file-figma.svg
│   │   │   │   ├── 🖼️ file-form.svg
│   │   │   │   ├── 🖼️ file-image-2.svg
│   │   │   │   ├── 🖼️ file-image.svg
│   │   │   │   ├── 🖼️ file-invoice.svg
│   │   │   │   ├── 🖼️ file-jpg.svg
│   │   │   │   ├── 🖼️ file-list.svg
│   │   │   │   ├── 🖼️ file-mov.svg
│   │   │   │   ├── 🖼️ file-mp4.svg
│   │   │   │   ├── 🖼️ file-notes.svg
│   │   │   │   ├── 🖼️ file-pdf.svg
│   │   │   │   ├── 🖼️ file-png.svg
│   │   │   │   ├── 🖼️ file-spreadsheet.svg
│   │   │   │   ├── 🖼️ file-svg.svg
│   │   │   │   ├── 🖼️ file-text.svg
│   │   │   │   ├── 🖼️ file-vector.svg
│   │   │   │   ├── 🖼️ file-zip.svg
│   │   │   │   ├── 🖼️ file.svg
│   │   │   │   └── 🖼️ png.svg
│   │   │   ├── 📁 finance
│   │   │   │   ├── 🖼️ bank.svg
│   │   │   │   ├── 🖼️ bill.svg
│   │   │   │   ├── 🖼️ cash.svg
│   │   │   │   ├── 🖼️ coin-2.svg
│   │   │   │   ├── 🖼️ coin.svg
│   │   │   │   ├── 🖼️ dollar.svg
│   │   │   │   ├── 🖼️ money-plant.svg
│   │   │   │   ├── 🖼️ piggy-bank.svg
│   │   │   │   ├── 🖼️ safe.svg
│   │   │   │   ├── 🖼️ saving.svg
│   │   │   │   ├── 🖼️ trend-down-square.svg
│   │   │   │   ├── 🖼️ trend-down.svg
│   │   │   │   ├── 🖼️ trend-up-square.svg
│   │   │   │   ├── 🖼️ trend-up.svg
│   │   │   │   └── 🖼️ wallet.svg
│   │   │   ├── 📁 food
│   │   │   │   ├── 🖼️ burger.svg
│   │   │   │   ├── 🖼️ cake.svg
│   │   │   │   ├── 🖼️ candy.svg
│   │   │   │   ├── 🖼️ cutlery.svg
│   │   │   │   ├── 🖼️ dish.svg
│   │   │   │   ├── 🖼️ drink.svg
│   │   │   │   ├── 🖼️ egg.svg
│   │   │   │   ├── 🖼️ fork.svg
│   │   │   │   ├── 🖼️ ice-cream.svg
│   │   │   │   ├── 🖼️ pizza-2.svg
│   │   │   │   ├── 🖼️ pizza.svg
│   │   │   │   ├── 🖼️ popsicle.svg
│   │   │   │   ├── 🖼️ spoon.svg
│   │   │   │   └── 🖼️ water.svg
│   │   │   ├── 📁 gender symbols
│   │   │   │   ├── 🖼️ bisexual.svg
│   │   │   │   ├── 🖼️ femaile.svg
│   │   │   │   ├── 🖼️ gay.svg
│   │   │   │   ├── 🖼️ genderless.svg
│   │   │   │   ├── 🖼️ hetro.svg
│   │   │   │   ├── 🖼️ intersex.svg
│   │   │   │   ├── 🖼️ lesbian.svg
│   │   │   │   ├── 🖼️ male.svg
│   │   │   │   ├── 🖼️ non-binary-transgender.svg
│   │   │   │   ├── 🖼️ other-gender.svg
│   │   │   │   ├── 🖼️ transgender-2.svg
│   │   │   │   └── 🖼️ transgender.svg
│   │   │   ├── 📁 hand gestures
│   │   │   │   ├── 🖼️ 2-double-tap.svg
│   │   │   │   ├── 🖼️ 2-scroll-left.svg
│   │   │   │   ├── 🖼️ 2-scroll-right.svg
│   │   │   │   ├── 🖼️ 2-scroll-up-1.svg
│   │   │   │   ├── 🖼️ 2-scroll-up.svg
│   │   │   │   ├── 🖼️ 2-tap-1.svg
│   │   │   │   ├── 🖼️ 2-tap.svg
│   │   │   │   ├── 🖼️ 2-touch-hold.svg
│   │   │   │   ├── 🖼️ 3-scroll-down.svg
│   │   │   │   ├── 🖼️ 3-scroll-up.svg
│   │   │   │   ├── 🖼️ 3-tap-scroll.svg
│   │   │   │   ├── 🖼️ 3-tap.svg
│   │   │   │   ├── 🖼️ clap.svg
│   │   │   │   ├── 🖼️ double-tap.svg
│   │   │   │   ├── 🖼️ folded-hands.svg
│   │   │   │   ├── 🖼️ free-drag.svg
│   │   │   │   ├── 🖼️ hand.svg
│   │   │   │   ├── 🖼️ horizontal-scroll.svg
│   │   │   │   ├── 🖼️ multi-touch.svg
│   │   │   │   ├── 🖼️ ok.svg
│   │   │   │   ├── 🖼️ page-move.svg
│   │   │   │   ├── 🖼️ point-down.svg
│   │   │   │   ├── 🖼️ point-left.svg
│   │   │   │   ├── 🖼️ point-right.svg
│   │   │   │   ├── 🖼️ point-up.svg
│   │   │   │   ├── 🖼️ rotate.svg
│   │   │   │   ├── 🖼️ scan-fingerprint.svg
│   │   │   │   ├── 🖼️ scan.svg
│   │   │   │   ├── 🖼️ screen-rotate.svg
│   │   │   │   ├── 🖼️ scroll-down.svg
│   │   │   │   ├── 🖼️ scroll-left-1.svg
│   │   │   │   ├── 🖼️ scroll-left.svg
│   │   │   │   ├── 🖼️ scroll-up.svg
│   │   │   │   ├── 🖼️ swipe-left.svg
│   │   │   │   ├── 🖼️ swipe-right.svg
│   │   │   │   ├── 🖼️ tap-1.svg
│   │   │   │   ├── 🖼️ tap.svg
│   │   │   │   ├── 🖼️ thumbs-down.svg
│   │   │   │   ├── 🖼️ thumbs-up.svg
│   │   │   │   ├── 🖼️ touch-hold.svg
│   │   │   │   ├── 🖼️ v.svg
│   │   │   │   ├── 🖼️ vibrate.svg
│   │   │   │   ├── 🖼️ wave-left.svg
│   │   │   │   ├── 🖼️ wave-right.svg
│   │   │   │   ├── 🖼️ zoom-in.svg
│   │   │   │   └── 🖼️ zoom-out.svg
│   │   │   ├── 📁 health
│   │   │   │   ├── 🖼️ blood-bag.svg
│   │   │   │   ├── 🖼️ blood.svg
│   │   │   │   ├── 🖼️ bottle.svg
│   │   │   │   ├── 🖼️ dropper.svg
│   │   │   │   ├── 🖼️ first-aid.svg
│   │   │   │   ├── 🖼️ firstaid-2.svg
│   │   │   │   ├── 🖼️ flask-round.svg
│   │   │   │   ├── 🖼️ flask.svg
│   │   │   │   ├── 🖼️ heart-beat.svg
│   │   │   │   ├── 🖼️ injection.svg
│   │   │   │   ├── 🖼️ lungs.svg
│   │   │   │   ├── 🖼️ medical-logo.svg
│   │   │   │   ├── 🖼️ microscope.svg
│   │   │   │   ├── 🖼️ pills.svg
│   │   │   │   ├── 🖼️ stethoscope.svg
│   │   │   │   ├── 🖼️ tablet.svg
│   │   │   │   ├── 🖼️ test-tube.svg
│   │   │   │   ├── 🖼️ tooth.svg
│   │   │   │   └── 🖼️ wheelchair.svg
│   │   │   ├── 📁 interface
│   │   │   │   ├── 🖼️ Info.svg
│   │   │   │   ├── 🖼️ analytics.svg
│   │   │   │   ├── 🖼️ arrow-down.svg
│   │   │   │   ├── 🖼️ arrow-up.svg
│   │   │   │   ├── 🖼️ arrow.svg
│   │   │   │   ├── 🖼️ at-the-rate.svg
│   │   │   │   ├── 🖼️ backward.svg
│   │   │   │   ├── 🖼️ bell-2.svg
│   │   │   │   ├── 🖼️ bell.svg
│   │   │   │   ├── 🖼️ bluetooth.svg
│   │   │   │   ├── 🖼️ bookmark.svg
│   │   │   │   ├── 🖼️ bulb.svg
│   │   │   │   ├── 🖼️ calculator.svg
│   │   │   │   ├── 🖼️ calendar.svg
│   │   │   │   ├── 🖼️ call.svg
│   │   │   │   ├── 🖼️ camera.svg
│   │   │   │   ├── 🖼️ caution.svg
│   │   │   │   ├── 🖼️ center-align-2.svg
│   │   │   │   ├── 🖼️ center-align.svg
│   │   │   │   ├── 🖼️ checklist.svg
│   │   │   │   ├── 🖼️ clock.svg
│   │   │   │   ├── 🖼️ cloud-down.svg
│   │   │   │   ├── 🖼️ cloud-up.svg
│   │   │   │   ├── 🖼️ cloud.svg
│   │   │   │   ├── 🖼️ cookie.svg
│   │   │   │   ├── 🖼️ copy.svg
│   │   │   │   ├── 🖼️ crop.svg
│   │   │   │   ├── 🖼️ cross.svg
│   │   │   │   ├── 🖼️ cut.svg
│   │   │   │   ├── 🖼️ dashboard-2.svg
│   │   │   │   ├── 🖼️ dashboard-3.svg
│   │   │   │   ├── 🖼️ dashboard-4.svg
│   │   │   │   ├── 🖼️ dashboard.svg
│   │   │   │   ├── 🖼️ delete.svg
│   │   │   │   ├── 🖼️ diamond.svg
│   │   │   │   ├── 🖼️ doc-add.svg
│   │   │   │   ├── 🖼️ doc-remove.svg
│   │   │   │   ├── 🖼️ doc.svg
│   │   │   │   ├── 🖼️ download.svg
│   │   │   │   ├── 🖼️ drawer.svg
│   │   │   │   ├── 🖼️ eject.svg
│   │   │   │   ├── 🖼️ eraser.svg
│   │   │   │   ├── 🖼️ fast-forward.svg
│   │   │   │   ├── 🖼️ fast-rewind.svg
│   │   │   │   ├── 🖼️ filter.svg
│   │   │   │   ├── 🖼️ flag-2.svg
│   │   │   │   ├── 🖼️ flag.svg
│   │   │   │   ├── 🖼️ flip.svg
│   │   │   │   ├── 🖼️ floppy.svg
│   │   │   │   ├── 🖼️ folder-add.svg
│   │   │   │   ├── 🖼️ folder-delete.svg
│   │   │   │   ├── 🖼️ folder-empty.svg
│   │   │   │   ├── 🖼️ folder-remove.svg
│   │   │   │   ├── 🖼️ folder.svg
│   │   │   │   ├── 🖼️ forward.svg
│   │   │   │   ├── 🖼️ gift.svg
│   │   │   │   ├── 🖼️ globe.svg
│   │   │   │   ├── 🖼️ grid-2.svg
│   │   │   │   ├── 🖼️ grid.svg
│   │   │   │   ├── 🖼️ headphone.svg
│   │   │   │   ├── 🖼️ heart.svg
│   │   │   │   ├── 🖼️ hide.svg
│   │   │   │   ├── 🖼️ home-1.svg
│   │   │   │   ├── 🖼️ home.svg
│   │   │   │   ├── 🖼️ key.svg
│   │   │   │   ├── 🖼️ layer.svg
│   │   │   │   ├── 🖼️ left-align-2.svg
│   │   │   │   ├── 🖼️ left-align.svg
│   │   │   │   ├── 🖼️ link.svg
│   │   │   │   ├── 🖼️ list.svg
│   │   │   │   ├── 🖼️ location-pin.svg
│   │   │   │   ├── 🖼️ lock.svg
│   │   │   │   ├── 🖼️ login.svg
│   │   │   │   ├── 🖼️ logout.svg
│   │   │   │   ├── 🖼️ magic-wand.svg
│   │   │   │   ├── 🖼️ mail-gift.svg
│   │   │   │   ├── 🖼️ mail-open.svg
│   │   │   │   ├── 🖼️ mail-surprise.svg
│   │   │   │   ├── 🖼️ mail.svg
│   │   │   │   ├── 🖼️ map.svg
│   │   │   │   ├── 🖼️ maximize.svg
│   │   │   │   ├── 🖼️ megaphone.svg
│   │   │   │   ├── 🖼️ menu-2.svg
│   │   │   │   ├── 🖼️ menu.svg
│   │   │   │   ├── 🖼️ message-2.svg
│   │   │   │   ├── 🖼️ message.svg
│   │   │   │   ├── 🖼️ mic-2.svg
│   │   │   │   ├── 🖼️ mic.svg
│   │   │   │   ├── 🖼️ minimize.svg
│   │   │   │   ├── 🖼️ move.svg
│   │   │   │   ├── 🖼️ music-2.svg
│   │   │   │   ├── 🖼️ music-3.svg
│   │   │   │   ├── 🖼️ music.svg
│   │   │   │   ├── 🖼️ mute.svg
│   │   │   │   ├── 🖼️ navigation-2.svg
│   │   │   │   ├── 🖼️ navigation.svg
│   │   │   │   ├── 🖼️ note.svg
│   │   │   │   ├── 🖼️ paint-bucket.svg
│   │   │   │   ├── 🖼️ paper-clip-2.svg
│   │   │   │   ├── 🖼️ paper-clip.svg
│   │   │   │   ├── 🖼️ paste.svg
│   │   │   │   ├── 🖼️ pause.svg
│   │   │   │   ├── 🖼️ pen-tool.svg
│   │   │   │   ├── 🖼️ pen.svg
│   │   │   │   ├── 🖼️ pencil-2.svg
│   │   │   │   ├── 🖼️ pencil-3.svg
│   │   │   │   ├── 🖼️ pencil-ruler.svg
│   │   │   │   ├── 🖼️ pencil.svg
│   │   │   │   ├── 🖼️ phone-setting.svg
│   │   │   │   ├── 🖼️ phone.svg
│   │   │   │   ├── 🖼️ photo.svg
│   │   │   │   ├── 🖼️ pie.svg
│   │   │   │   ├── 🖼️ pin.svg
│   │   │   │   ├── 🖼️ play.svg
│   │   │   │   ├── 🖼️ puzzle-2.svg
│   │   │   │   ├── 🖼️ puzzle.svg
│   │   │   │   ├── 🖼️ question-2.svg
│   │   │   │   ├── 🖼️ question.svg
│   │   │   │   ├── 🖼️ record.svg
│   │   │   │   ├── 🖼️ rectangle.svg
│   │   │   │   ├── 🖼️ right-align-2.svg
│   │   │   │   ├── 🖼️ right-align.svg
│   │   │   │   ├── 🖼️ rss.svg
│   │   │   │   ├── 🖼️ ruler.svg
│   │   │   │   ├── 🖼️ scan.svg
│   │   │   │   ├── 🖼️ search.svg
│   │   │   │   ├── 🖼️ send-2.svg
│   │   │   │   ├── 🖼️ send-3.svg
│   │   │   │   ├── 🖼️ send.svg
│   │   │   │   ├── 🖼️ server.svg
│   │   │   │   ├── 🖼️ setting-2.svg
│   │   │   │   ├── 🖼️ setting-3.svg
│   │   │   │   ├── 🖼️ setting.svg
│   │   │   │   ├── 🖼️ shape.svg
│   │   │   │   ├── 🖼️ shield-2.svg
│   │   │   │   ├── 🖼️ shield.svg
│   │   │   │   ├── 🖼️ shuffle.svg
│   │   │   │   ├── 🖼️ signal.svg
│   │   │   │   ├── 🖼️ speaker.svg
│   │   │   │   ├── 🖼️ square.svg
│   │   │   │   ├── 🖼️ star.svg
│   │   │   │   ├── 🖼️ stopwatch.svg
│   │   │   │   ├── 🖼️ suitcase.svg
│   │   │   │   ├── 🖼️ sun-2.svg
│   │   │   │   ├── 🖼️ sun-3.svg
│   │   │   │   ├── 🖼️ sun-4.svg
│   │   │   │   ├── 🖼️ sun.svg
│   │   │   │   ├── 🖼️ switch-1.svg
│   │   │   │   ├── 🖼️ switch.svg
│   │   │   │   ├── 🖼️ sync.svg
│   │   │   │   ├── 🖼️ tablet.svg
│   │   │   │   ├── 🖼️ target-2.svg
│   │   │   │   ├── 🖼️ target.svg
│   │   │   │   ├── 🖼️ thumbs-up.svg
│   │   │   │   ├── 🖼️ tick-2.svg
│   │   │   │   ├── 🖼️ tick.svg
│   │   │   │   ├── 🖼️ transform.svg
│   │   │   │   ├── 🖼️ tree-2.svg
│   │   │   │   ├── 🖼️ tree.svg
│   │   │   │   ├── 🖼️ trophy.svg
│   │   │   │   ├── 🖼️ unhide.svg
│   │   │   │   ├── 🖼️ unlink.svg
│   │   │   │   ├── 🖼️ upload.svg
│   │   │   │   ├── 🖼️ user-add.svg
│   │   │   │   ├── 🖼️ user-caution.svg
│   │   │   │   ├── 🖼️ user-delete.svg
│   │   │   │   ├── 🖼️ user-female.svg
│   │   │   │   ├── 🖼️ user-male.svg
│   │   │   │   ├── 🖼️ user-remove.svg
│   │   │   │   ├── 🖼️ user.svg
│   │   │   │   ├── 🖼️ video-camera.svg
│   │   │   │   ├── 🖼️ volume-down.svg
│   │   │   │   ├── 🖼️ volume-up.svg
│   │   │   │   ├── 🖼️ zap.svg
│   │   │   │   ├── 🖼️ zoom-in.svg
│   │   │   │   ├── 🖼️ zoom-out-1.svg
│   │   │   │   └── 🖼️ zoom-out.svg
│   │   │   ├── 📁 logos
│   │   │   │   ├── 🖼️ apple.svg
│   │   │   │   ├── 🖼️ behance.svg
│   │   │   │   ├── 🖼️ codepen.svg
│   │   │   │   ├── 🖼️ dribbble.svg
│   │   │   │   ├── 🖼️ dropbox.svg
│   │   │   │   ├── 🖼️ facebook-2.svg
│   │   │   │   ├── 🖼️ facebook.svg
│   │   │   │   ├── 🖼️ fb-messenger.svg
│   │   │   │   ├── 🖼️ google.svg
│   │   │   │   ├── 🖼️ instagram.svg
│   │   │   │   ├── 🖼️ linkedin.svg
│   │   │   │   ├── 🖼️ paypal.svg
│   │   │   │   ├── 🖼️ pinterest.svg
│   │   │   │   ├── 🖼️ product hunt.svg
│   │   │   │   ├── 🖼️ skype.svg
│   │   │   │   ├── 🖼️ snapchat.svg
│   │   │   │   ├── 🖼️ spotify.svg
│   │   │   │   ├── 🖼️ tik tok.svg
│   │   │   │   ├── 🖼️ tumblr.svg
│   │   │   │   ├── 🖼️ twitch.svg
│   │   │   │   ├── 🖼️ twitter.svg
│   │   │   │   ├── 🖼️ uber.svg
│   │   │   │   ├── 🖼️ webflow.svg
│   │   │   │   ├── 🖼️ whatsapp.svg
│   │   │   │   ├── 🖼️ windows.svg
│   │   │   │   ├── 🖼️ y-combinator.svg
│   │   │   │   └── 🖼️ youtube.svg
│   │   │   ├── 📁 misc
│   │   │   │   ├── 🖼️ automation.svg
│   │   │   │   ├── 🖼️ bot.svg
│   │   │   │   ├── 🖼️ bug.svg
│   │   │   │   ├── 🖼️ bus.svg
│   │   │   │   ├── 🖼️ car.svg
│   │   │   │   ├── 🖼️ chip.svg
│   │   │   │   ├── 🖼️ coffee-cup-1.svg
│   │   │   │   ├── 🖼️ coffee-cup-2.svg
│   │   │   │   ├── 🖼️ fire.svg
│   │   │   │   ├── 🖼️ hot-air-balloon.svg
│   │   │   │   ├── 🖼️ plane.svg
│   │   │   │   ├── 🖼️ rocket.svg
│   │   │   │   ├── 🖼️ satellite.svg
│   │   │   │   ├── 🖼️ server.svg
│   │   │   │   ├── 🖼️ ship.svg
│   │   │   │   └── 🖼️ trophy.svg
│   │   │   ├── 📁 objects
│   │   │   │   ├── 🖼️ anchor.svg
│   │   │   │   ├── 🖼️ balloon-2.svg
│   │   │   │   ├── 🖼️ balloon.svg
│   │   │   │   ├── 🖼️ camera.svg
│   │   │   │   ├── 🖼️ crown.svg
│   │   │   │   ├── 🖼️ flashlight.svg
│   │   │   │   ├── 🖼️ frame.svg
│   │   │   │   ├── 🖼️ guitar.svg
│   │   │   │   ├── 🖼️ movie-clapper.svg
│   │   │   │   ├── 🖼️ paint-brush-2.svg
│   │   │   │   ├── 🖼️ paint-brush.svg
│   │   │   │   ├── 🖼️ paint-bucket.svg
│   │   │   │   ├── 🖼️ paint-roller.svg
│   │   │   │   ├── 🖼️ sofa.svg
│   │   │   │   └── 🖼️ tv.svg
│   │   │   ├── 📁 weather
│   │   │   │   ├── 🖼️ Vector.svg
│   │   │   │   ├── 🖼️ cloudy-day.svg
│   │   │   │   ├── 🖼️ cloudy-night.svg
│   │   │   │   ├── 🖼️ night.svg
│   │   │   │   ├── 🖼️ rain-heavy.svg
│   │   │   │   ├── 🖼️ rain-light.svg
│   │   │   │   ├── 🖼️ snow.svg
│   │   │   │   ├── 🖼️ snowflake.svg
│   │   │   │   ├── 🖼️ snowman.svg
│   │   │   │   ├── 🖼️ sunny.svg
│   │   │   │   ├── 🖼️ thunderstorm.svg
│   │   │   │   ├── 🖼️ tornado.svg
│   │   │   │   └── 🖼️ wind.svg
│   │   │   ├── 🖼️ car.png
│   │   │   ├── 🖼️ dni_back.svg
│   │   │   ├── 🖼️ passport.svg
│   │   │   ├── 🖼️ pilgrim_shell.svg
│   │   │   ├── 🖼️ pilgrim_shell_bw.svg
│   │   │   └── 🖼️ shell.png
│   │   ├── 📁 videos
│   │   ├── 🖼️ albergue-foto-gm-sin-ruido-vectorizado-con-personas.png
│   │   ├── 🖼️ albergue-personas-trazo-fino.svg
│   │   ├── 🖼️ dnifront.svg
│   │   ├── 🖼️ favicon.svg
│   │   ├── 📄 robots.txt
│   │   ├── 🖼️ vectorized.svg
│   │   └── 🖼️ vite.svg
│   ├── 📁 scripts
│   │   ├── 📄 build-frontend.sh
│   │   ├── 📄 check-i18n.js
│   │   ├── 📄 create-locale-files.js
│   │   ├── 📄 deploy.mjs
│   │   ├── 📄 stormkit-env.mjs
│   │   ├── 📄 stormkit-status.mjs
│   │   ├── 📄 type-check.js
│   │   └── 📄 validate-i18n.js
│   ├── 📁 src
│   │   ├── 📁 components
│   │   │   ├── 📁 LanguageSelector
│   │   │   │   └── 📁 locales
│   │   │   │       ├── 📁 Gode
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 ca
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 cs
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 de
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 en
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 es
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 eu
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 fr
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 gl
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 hu
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 it
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 ja
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 ko
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 nl
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 oc
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 pl
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 pt
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 ru
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       ├── 📁 sk
│   │   │   │       │   ├── ⚙️ admin.json
│   │   │   │       │   ├── ⚙️ booking.json
│   │   │   │       │   ├── ⚙️ common.json
│   │   │   │       │   ├── ⚙️ dashboard.json
│   │   │   │       │   ├── ⚙️ messages.json
│   │   │   │       │   └── ⚙️ navigation.json
│   │   │   │       └── 📁 zh
│   │   │   │           ├── ⚙️ admin.json
│   │   │   │           ├── ⚙️ booking.json
│   │   │   │           ├── ⚙️ common.json
│   │   │   │           ├── ⚙️ dashboard.json
│   │   │   │           ├── ⚙️ messages.json
│   │   │   │           └── ⚙️ navigation.json
│   │   │   ├── 📁 admin
│   │   │   │   └── 📄 ServiceStatus.astro
│   │   │   ├── 📁 analytics
│   │   │   │   └── 📄 GoogleAnalytics.astro
│   │   │   ├── 📁 core
│   │   │   │   ├── 📄 Button.astro
│   │   │   │   ├── 📄 Card.astro
│   │   │   │   ├── 📄 RoughIcon.astro
│   │   │   │   ├── 📄 Stats.astro
│   │   │   │   └── 📄 statsUtils.ts
│   │   │   ├── 📁 doodle
│   │   │   │   ├── 📄 DoodleBadge.astro
│   │   │   │   ├── 📄 DoodleButton.astro
│   │   │   │   ├── 📄 DoodleCard.astro
│   │   │   │   ├── 📄 DoodleIcons.astro
│   │   │   │   ├── 📄 DoodlePattern.astro
│   │   │   │   ├── 📄 FeatureCard.astro
│   │   │   │   ├── 📄 InfoBadge.astro
│   │   │   │   ├── 📄 SketchyButton.astro
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 layout
│   │   │   │   ├── 📄 Head.astro
│   │   │   │   ├── 📄 Hero.astro
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ui
│   │   │   │   ├── 📄 Badge.astro
│   │   │   │   ├── 📄 Button.astro
│   │   │   │   ├── 📄 Card.astro
│   │   │   │   ├── 📄 Hero.astro
│   │   │   │   ├── 📄 Input.astro
│   │   │   │   ├── 📄 Stat.astro
│   │   │   │   └── 📄 statsUtils.ts
│   │   │   ├── 📄 BookingConfirmation.astro
│   │   │   ├── 📄 Button.astro
│   │   │   ├── 📄 CaminoDashboard.astro
│   │   │   ├── 🎨 CaminoDashboard.css
│   │   │   ├── 📄 Card.astro
│   │   │   ├── 📄 DoodleCard.astro
│   │   │   ├── 📄 FeatureCard.astro
│   │   │   ├── 📄 Head.astro
│   │   │   ├── 📄 Hero.astro
│   │   │   ├── 📄 Hostel3DThreeJS.astro
│   │   │   ├── 📄 InfoBadge.astro
│   │   │   ├── 📄 RoughFrame.astro
│   │   │   ├── 📄 SketchyButton.astro
│   │   │   ├── 📄 Stats.astro
│   │   │   ├── 📄 UserProfile.astro
│   │   │   ├── 🎨 UserProfile.css
│   │   │   └── 📄 index.ts
│   │   ├── 📁 config
│   │   │   └── 📄 swup.config.ts
│   │   ├── 📁 integrations
│   │   │   └── 📄 storybook-astro.ts
│   │   ├── 📁 islands
│   │   │   ├── 📁 booking
│   │   │   ├── 📁 shared
│   │   │   │   └── 📄 LanguageSelectorIsland.astro
│   │   │   └── 📄 index.ts
│   │   ├── 📁 layouts
│   │   │   ├── 📄 AdminLayout.astro
│   │   │   ├── 📄 BaseLayout.astro
│   │   │   ├── 📄 FigmaLayout.astro
│   │   │   └── 📄 Layout.astro
│   │   ├── 📁 lib
│   │   │   └── 📄 healthchecks.ts
│   │   ├── 📁 locales
│   │   │   ├── 📁 .wuchale
│   │   │   │   ├── ⚙️ confUpdate.json
│   │   │   │   ├── 📄 main.main.ar.compiled.js
│   │   │   │   ├── 📄 main.main.ast.compiled.js
│   │   │   │   ├── 📄 main.main.ca.compiled.js
│   │   │   │   ├── 📄 main.main.de.compiled.js
│   │   │   │   ├── 📄 main.main.en.compiled.js
│   │   │   │   ├── 📄 main.main.es.compiled.js
│   │   │   │   ├── 📄 main.main.eu.compiled.js
│   │   │   │   ├── 📄 main.main.fr.compiled.js
│   │   │   │   ├── 📄 main.main.gl.compiled.js
│   │   │   │   ├── 📄 main.main.hi.compiled.js
│   │   │   │   ├── 📄 main.main.id.compiled.js
│   │   │   │   ├── 📄 main.main.it.compiled.js
│   │   │   │   ├── 📄 main.main.ja.compiled.js
│   │   │   │   ├── 📄 main.main.ko.compiled.js
│   │   │   │   ├── 📄 main.main.manifest.js
│   │   │   │   ├── 📄 main.main.pt.compiled.js
│   │   │   │   ├── 📄 main.main.ru.compiled.js
│   │   │   │   ├── 📄 main.main.tr.compiled.js
│   │   │   │   ├── 📄 main.main.vi.compiled.js
│   │   │   │   ├── 📄 main.main.zh.compiled.js
│   │   │   │   ├── 📄 main.proxy.js
│   │   │   │   └── 📄 main.proxy.sync.js
│   │   │   ├── 📄 ar.po
│   │   │   ├── 📄 ast.po
│   │   │   ├── 📄 ca.po
│   │   │   ├── 📄 data.js
│   │   │   ├── 📄 de.po
│   │   │   ├── 📄 en.po
│   │   │   ├── 📄 es.po
│   │   │   ├── 📄 eu.po
│   │   │   ├── 📄 fr.po
│   │   │   ├── 📄 gl.po
│   │   │   ├── 📄 hi.po
│   │   │   ├── 📄 id.po
│   │   │   ├── 📄 it.po
│   │   │   ├── 📄 ja.po
│   │   │   ├── 📄 ko.po
│   │   │   ├── 📄 main.loader.js
│   │   │   ├── 📄 pt.po
│   │   │   ├── 📄 ru.po
│   │   │   ├── 📄 tr.po
│   │   │   ├── 📄 vi.po
│   │   │   └── 📄 zh.po
│   │   ├── 📁 pages
│   │   │   ├── 📁 admin
│   │   │   │   ├── 📄 index.astro
│   │   │   │   ├── 📄 services-realtime.astro
│   │   │   │   └── 📄 services.astro
│   │   │   ├── 📄 404.astro
│   │   │   ├── 📄 _app.astro
│   │   │   ├── 📄 book.astro
│   │   │   ├── 📄 booking-confirmed.astro
│   │   │   ├── 📄 booking.astro
│   │   │   ├── 📄 camino-dashboard.astro
│   │   │   ├── 📄 camino.astro
│   │   │   ├── 📄 dashboard.astro
│   │   │   ├── 📄 demo-booking-confirmed.astro
│   │   │   ├── 📄 demo-camino.astro
│   │   │   ├── 📄 demo-user-profile.astro
│   │   │   ├── 📄 index.astro
│   │   │   ├── 📄 info.astro
│   │   │   └── 📄 webcore-smoke.astro
│   │   ├── 📁 scripts
│   │   │   ├── 📝 ANIMATIONS_GUIDE.md
│   │   │   ├── 📝 README.md
│   │   │   ├── 📄 runtime.ts
│   │   │   ├── 📄 runtime_rough.ts
│   │   │   ├── 📄 runtime_stores_bridge.ts
│   │   │   ├── 📄 swup-animations.ts
│   │   │   └── 📄 swup-plugins.ts
│   │   ├── 📁 stores
│   │   │   ├── 📄 app.ts
│   │   │   ├── 📄 bookingStore.ts
│   │   │   ├── 📄 i18nStore.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 pilgrim-auth.ts
│   │   │   ├── 📄 pilgrim.ts
│   │   │   ├── 📄 redis.ts
│   │   │   └── 📄 user.ts
│   │   ├── 📁 styles
│   │   │   ├── 🎨 animations.css
│   │   │   ├── 🎨 booking-confirmation.css
│   │   │   ├── 🎨 design-system.css
│   │   │   ├── 🎨 figma-design.css
│   │   │   └── 🎨 global.css
│   │   ├── 📁 types
│   │   │   ├── 📄 components.ts
│   │   │   ├── 📄 global.d.ts
│   │   │   ├── 📄 pilgrim-operations.ts
│   │   │   └── 📄 pilgrim.ts
│   │   ├── 📄 ambient-modules.d.ts
│   │   ├── 📄 env.d.ts
│   │   ├── 🎨 index.css
│   │   ├── 📄 middleware.ts
│   │   └── 📄 ui-components.ts
│   ├── 📁 tests
│   │   ├── 📁 components
│   │   │   ├── 📄 Booking.test.tsx
│   │   │   ├── 📄 BookingConfirmation.test.tsx
│   │   │   ├── 📄 BookingFlow.test.tsx
│   │   │   ├── 📄 BookingSuccess.test.tsx
│   │   │   ├── 📄 IDDocumentUpload.test.tsx
│   │   │   ├── 📄 Navigation.test.tsx
│   │   │   ├── 📄 ToastDemo.test.tsx
│   │   │   └── 📄 simple.test.tsx
│   │   ├── 📁 e2e
│   │   │   └── 📄 site.spec.ts
│   │   ├── 📁 fixtures
│   │   │   └── 📄 mockBooking.ts
│   │   ├── 📁 pages
│   │   │   └── 📄 BookingPage.test.tsx
│   │   ├── 📄 astro.d.ts
│   │   └── 📄 setup.ts
│   ├── ⚙️ .gitignore
│   ├── ⚙️ .npmrc
│   ├── ⚙️ .prettierignore
│   ├── ⚙️ .prettierrc.json
│   ├── ⚙️ .trigger
│   ├── 📄 LICENSE
│   ├── 📝 README.md
│   ├── 📝 TYPESCRIPT_GUIDE.md
│   ├── 📄 astro.config.cloudflare.mjs
│   ├── 📄 astro.config.mjs
│   ├── 📄 astro.config.netlify.mjs
│   ├── 📄 astro.config.shared.mjs
│   ├── 📄 astro.config.stormkit.mjs
│   ├── 📄 eslint.config.js
│   ├── 📄 eslint.config.mjs
│   ├── ⚙️ netlify.toml
│   ├── ⚙️ package.json
│   ├── 📄 playwright.config.ts
│   ├── 📄 prettier.config.mjs
│   ├── ⚙️ stormkit.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.typecheck.json
│   ├── 📄 uno.config.ts
│   ├── 📄 vitest.config.ts
│   ├── 🎨 webcore.config.scss
│   └── 📄 wrangler.jsonc
├── 📁 packages
│   └── 📁 astro-roughjs
│       ├── 📁 example
│       ├── 📁 src
│       │   ├── 📄 index.ts
│       │   ├── 📄 integration.ts
│       │   └── 📄 rough-init.ts
│       ├── ⚙️ package.json
│       └── ⚙️ tsconfig.json
├── 📁 taskfiles
│   ├── 📝 README.md
│   ├── ⚙️ Taskfile.act.yml
│   ├── ⚙️ Taskfile.arch.yml
│   ├── ⚙️ Taskfile.build.yml
│   ├── ⚙️ Taskfile.clean.yml
│   ├── ⚙️ Taskfile.connectivity.yml
│   ├── ⚙️ Taskfile.deploy.yml
│   ├── ⚙️ Taskfile.dev.yml
│   ├── ⚙️ Taskfile.frontend.yml
│   ├── ⚙️ Taskfile.github.yml
│   ├── ⚙️ Taskfile.main.yml
│   ├── ⚙️ Taskfile.pages.yml
│   ├── ⚙️ Taskfile.ports.yml
│   ├── ⚙️ Taskfile.quality.yml
│   ├── ⚙️ Taskfile.security.yml
│   ├── ⚙️ Taskfile.setup.yml
│   ├── ⚙️ Taskfile.spin.yml
│   ├── ⚙️ Taskfile.test.yml
│   └── ⚙️ Taskfile.turso.yml
├── 📁 vendor
│   └── 📁 rough
│       ├── 📁 .github
│       │   └── ⚙️ FUNDING.yml
│       ├── 📁 src
│       │   ├── 📁 fillers
│       │   │   ├── 📄 dashed-filler.ts
│       │   │   ├── 📄 dot-filler.ts
│       │   │   ├── 📄 filler-interface.ts
│       │   │   ├── 📄 filler.ts
│       │   │   ├── 📄 hachure-filler.ts
│       │   │   ├── 📄 hatch-filler.ts
│       │   │   ├── 📄 scan-line-hachure.ts
│       │   │   ├── 📄 zigzag-filler.ts
│       │   │   └── 📄 zigzag-line-filler.ts
│       │   ├── 📄 canvas.ts
│       │   ├── 📄 core.ts
│       │   ├── 📄 generator.ts
│       │   ├── 📄 geometry.ts
│       │   ├── 📄 math.ts
│       │   ├── 📄 renderer.ts
│       │   ├── 📄 rough.ts
│       │   └── 📄 svg.ts
│       ├── 📁 visual-tests
│       │   ├── 📁 canvas
│       │   │   ├── 📁 dashed
│       │   │   │   ├── 🌐 arc.html
│       │   │   │   ├── 🌐 curve.html
│       │   │   │   ├── 🌐 ellipse.html
│       │   │   │   ├── 🌐 line.html
│       │   │   │   ├── 🌐 linearpath.html
│       │   │   │   ├── 🌐 path-with-transform.html
│       │   │   │   ├── 🌐 path.html
│       │   │   │   ├── 🌐 polygon.html
│       │   │   │   └── 🌐 rectangle.html
│       │   │   ├── 📁 singlestroke
│       │   │   │   ├── 🌐 arc.html
│       │   │   │   ├── 🌐 curve.html
│       │   │   │   ├── 🌐 ellipse.html
│       │   │   │   ├── 🌐 line.html
│       │   │   │   ├── 🌐 path.html
│       │   │   │   ├── 🌐 polygon.html
│       │   │   │   └── 🌐 rectangle.html
│       │   │   ├── 🌐 arc.html
│       │   │   ├── 🌐 arc2.html
│       │   │   ├── 🌐 curve-seed.html
│       │   │   ├── 🌐 curve.html
│       │   │   ├── 🌐 curve2.html
│       │   │   ├── 🌐 curve3.html
│       │   │   ├── 🌐 curve4.html
│       │   │   ├── 🌐 ellipse.html
│       │   │   ├── 🌐 ellipse2.html
│       │   │   ├── 🌐 ellipse3.html
│       │   │   ├── 🌐 line.html
│       │   │   ├── 🌐 linearpath.html
│       │   │   ├── 🌐 map.html
│       │   │   ├── 🌐 path-with-transform.html
│       │   │   ├── 🌐 path.html
│       │   │   ├── 🌐 path2.html
│       │   │   ├── 🌐 path3.html
│       │   │   ├── 🌐 path4.html
│       │   │   ├── 🌐 path5.html
│       │   │   ├── 🌐 path6.html
│       │   │   ├── 🌐 path7.html
│       │   │   ├── 🌐 poly-seed.html
│       │   │   ├── 🌐 polygon.html
│       │   │   ├── 🌐 polygon2.html
│       │   │   ├── 🌐 rectangle.html
│       │   │   └── ⚙️ us.json
│       │   └── 📁 svg
│       │       ├── 📁 dashed
│       │       │   ├── 🌐 ellipse.html
│       │       │   ├── 🌐 line.html
│       │       │   ├── 🌐 polygon.html
│       │       │   └── 🌐 rectangle.html
│       │       ├── 🌐 ellipse.html
│       │       ├── 🌐 line.html
│       │       ├── 🌐 polygon.html
│       │       ├── 🌐 rectangle.html
│       │       └── 🌐 rectangle2.html
│       ├── ⚙️ .eslintrc.json
│       ├── ⚙️ .gitignore
│       ├── ⚙️ .npmignore
│       ├── 📝 CHANGELOG.md
│       ├── 📄 LICENSE
│       ├── 📝 README.md
│       ├── ⚙️ package-lock.json
│       ├── ⚙️ package.json
│       ├── 📄 rollup.config.js
│       └── ⚙️ tsconfig.json
├── ⚙️ .gitignore
├── ⚙️ .pnpmfile.cjs
├── ⚙️ .prettierignore
├── 📝 AGENTS.md
├── 📝 README.md
├── ⚙️ Taskfile.yml
├── 📄 opencode-sync-tasks.sh
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
├── ⚙️ pnpm-workspace.yaml
└── ⚙️ skills-lock.json
```

---

_Generated by FileTree Pro Extension_
