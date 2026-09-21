-- Seed data for the Places gallery + Hostel content aggregates (migration
-- 0004_places_and_hostel). Run once against a fresh/dev database where these
-- tables are empty -- serial IDs are assumed to start at 1 and increment in
-- insertion order, matching the style of dev_seed.sql.
--
-- Content is migrated from what was previously hardcoded in the frontend:
-- footerData.ts (hostels + social links + certifications + compliance
-- badges), HostelServicesPage.tsx (hostel_services, opening hours),
-- AreaEatPage.tsx (places: restaurant), AreaVisitPage.tsx (places: trail /
-- park / excursion). AreaDoPage.tsx's content is general area-orientation
-- prose (not a POI listing) and has no place here.

-- ============================================================
-- Hostel (singleton)
-- ============================================================
INSERT INTO hostels (
  name_es, name_en, tagline_es, tagline_en,
  about_markdown_es, about_markdown_en,
  history_markdown_es, history_markdown_en,
  address_street, address_postal_code, address_city, address_region, address_country,
  latitude, longitude, phone, email,
  check_in_from, check_in_until, check_out_before,
  touristic_registry, cif, rural_tourism_license, data_protection_officer, rgpd_registry,
  arbitration_board, arbitration_url, odr_platform, accessibility_level,
  liability_insurance, insurance_company, payment_methods
) VALUES (
  'Albergue Municipal de Carrascalejo', 'Albergue Municipal de Carrascalejo',
  'Tu lugar de descanso en la Vía de la Plata', 'Your resting place on the Vía de la Plata',
  'Un albergue municipal acogedor en el corazón de Extremadura, pensado para peregrinos que recorren la Vía de la Plata.',
  'A welcoming municipal hostel in the heart of Extremadura, built for pilgrims walking the Vía de la Plata.',
  'El albergue ocupa un edificio tradicional restaurado de Carrascalejo, abierto a peregrinos desde hace más de una década.',
  'The hostel occupies a restored traditional building in Carrascalejo, open to pilgrims for over a decade.',
  -- Coordinates are the real "El Carrascalejo, Badajoz" village centroid,
  -- geocoded via Nominatim (see geocode.mjs): the previous placeholder
  -- (39.1234, -5.6789, inherited from footerData.ts) was ~70km off, in a
  -- different part of Extremadura entirely. No street-level OSM data
  -- exists for "Calle Principal" in this village, so the village centroid
  -- is the most precise real anchor available; a precise street-level pin
  -- needs manual correction once the real street address is known.
  'Calle Principal, 123', '10680', 'El Carrascalejo', 'Extremadura', 'España',
  39.0223673, -6.3371905, '+34 924 XXX XXX', 'info@alberguecarrascalejo.com',
  '15:00', '22:00', '11:00',
  'H-CC-00123', 'B-12345678', 'ATR-EX-2024-001', 'dpo@alberguecarrascalejo.com', 'AEPD-R-2024-12345',
  'Junta Arbitral de Consumo de Extremadura', 'https://consumo.juntaex.es', 'https://ec.europa.eu/consumers/odr',
  'AA WCAG 2.1', 'Póliza RC-123456789', 'Seguros Turísticos SA',
  ARRAY['visa', 'mastercard', 'amex', 'paypal', 'bizum', 'cash']
);

-- ============================================================
-- Hostel social links, certifications, compliance badges
-- ============================================================
INSERT INTO hostel_social_links (hostel_id, platform, url, display_order) VALUES
  (1, 'facebook', 'https://facebook.com/alberguecarrascalejo', 0),
  (1, 'instagram', 'https://instagram.com/alberguecarrascalejo', 1),
  (1, 'twitter', 'https://twitter.com/alberguecarrascalejo', 2),
  (1, 'youtube', 'https://youtube.com/@alberguecarrascalejo', 3),
  (1, 'tripadvisor', 'https://tripadvisor.com/alberguecarrascalejo', 4);

INSERT INTO hostel_certifications (hostel_id, name_es, name_en, badge_icon_name, display_order) VALUES
  (1, 'Albergue Oficial del Camino de Santiago', 'Official Camino de Santiago Hostel', 'camino-official', 0),
  (1, 'Turismo de Extremadura', 'Extremadura Tourism', 'extremadura-tourism', 1),
  (1, 'Sello de Calidad Turística', 'Tourism Quality Seal', 'quality-seal', 2),
  (1, 'Accesibilidad Universal', 'Universal Accessibility', 'accessibility', 3);

INSERT INTO hostel_compliance_badges (hostel_id, code, name_es, name_en, description_es, description_en, display_order) VALUES
  (1, 'gdpr', 'Cumplimiento RGPD', 'GDPR Compliant', 'Reglamento General de Protección de Datos', 'Reglamento General de Protección de Datos', 0),
  (1, 'lssi', 'Cumplimiento LSSI', 'LSSI Compliant', 'Ley de Servicios de la Sociedad de la Información', 'Ley de Servicios de la Sociedad de la Información', 1),
  (1, 'lopd', 'Cumplimiento LOPD', 'LOPD Compliant', 'Ley Orgánica de Protección de Datos', 'Ley Orgánica de Protección de Datos', 2),
  (1, 'ssl', 'Conexión Segura SSL', 'SSL Secure Connection', 'Certificado SSL/TLS', 'Certificado SSL/TLS', 3);

-- ============================================================
-- Hostel services (house rules + emergency contacts, from
-- HostelServicesPage.tsx's RULES_DATA / EMERGENCIES_DATA)
-- ============================================================
INSERT INTO hostel_services (hostel_id, title_es, title_en, description_es, description_en, price, icon_name, display_order) VALUES
  (1, 'Horarios', 'Hours', 'Entrada 15:00–22:00 · Salida antes de las 11:00 · Silencio 22:00–07:00 · Cocina cierra a las 21:30.', 'Check-in 3:00–10:00 PM · Check-out before 11:00 AM · Quiet hours 10:00 PM–7:00 AM · Kitchen closes at 9:30 PM.', NULL, 'clock', 0),
  (1, 'Convivencia', 'Shared living', 'Zonas comunes limpias, respeta el descanso de otros peregrinos, no fumar en interiores, mascotas no permitidas.', 'Keep common areas clean, respect other pilgrims'' rest, no smoking indoors, pets not allowed.', NULL, 'clipboard', 1),
  (1, 'Seguridad', 'Security', 'Taquillas con candado, no dejes objetos de valor a la vista, extintores señalizados en todo el edificio.', 'Lockers with a padlock, don''t leave valuables in plain sight, fire extinguishers signposted throughout.', NULL, 'shield', 2),
  (1, 'Servicios incluidos', 'Included services', 'WiFi gratuito, ropa de cama incluida, uso libre de la cocina, consigna de equipaje disponible.', 'Free WiFi, linens included, free use of the kitchen, luggage storage available.', NULL, 'check-circle', 3),
  (1, 'Emergencias Generales (112)', 'General Emergency (112)', 'Policía, bomberos y sanidad para cualquier emergencia. Disponible 24/7.', 'Police, fire and medical for any emergency. Available 24/7.', NULL, 'phone', 4),
  (1, 'Emergencia Médica (061)', 'Medical Emergency (061)', 'Ambulancia y asistencia médica urgente. Disponible 24/7.', 'Ambulance and urgent medical assistance. Available 24/7.', NULL, 'phone', 5),
  (1, 'Policía Local (092)', 'Local Police (092)', 'Policía local de Carrascalejo. Disponible 24/7.', 'Carrascalejo local police. Available 24/7.', NULL, 'phone', 6),
  (1, 'Centro de Salud (924 123 456)', 'Health Center (924 123 456)', 'Centro de Salud de Carrascalejo, para consultas no urgentes. L–V: 9:00–21:00.', 'Carrascalejo Health Center, for non-urgent matters. Mon–Fri: 9am–9pm.', NULL, 'phone', 7);

-- ============================================================
-- Opening hours (reception, daily 15:00-22:00)
-- ============================================================
INSERT INTO hostel_opening_hours (hostel_id, area, day_of_week, opens_at, closes_at) VALUES
  (1, 'reception', 0, '15:00', '22:00'),
  (1, 'reception', 1, '15:00', '22:00'),
  (1, 'reception', 2, '15:00', '22:00'),
  (1, 'reception', 3, '15:00', '22:00'),
  (1, 'reception', 4, '15:00', '22:00'),
  (1, 'reception', 5, '15:00', '22:00'),
  (1, 'reception', 6, '15:00', '22:00'),
  (1, 'kitchen', 0, '07:00', '21:30'),
  (1, 'kitchen', 1, '07:00', '21:30'),
  (1, 'kitchen', 2, '07:00', '21:30'),
  (1, 'kitchen', 3, '07:00', '21:30'),
  (1, 'kitchen', 4, '07:00', '21:30'),
  (1, 'kitchen', 5, '07:00', '21:30'),
  (1, 'kitchen', 6, '07:00', '21:30');

-- ============================================================
-- Physical structure: 1 building -> 2 bedrooms -> 6 bunks each -> 24 beds
-- (matches the homepage's "2 dormitorios con 12 camas cada uno" / "24
-- disponibles" copy)
-- ============================================================
INSERT INTO hostel_buildings (hostel_id, name_es, name_en, description_markdown_es, description_markdown_en, floor_count, display_order) VALUES
  (1, 'Edificio Principal', 'Main Building', 'El único edificio del albergue, con dos dormitorios compartidos.', 'The hostel''s single building, with two shared dormitories.', 1, 0);

INSERT INTO hostel_bedrooms (building_id, room_number, name_es, name_en, room_type, floor, display_order) VALUES
  (1, '1', 'Dormitorio 1', 'Dormitory 1', 'dormitory', 1, 0),
  (1, '2', 'Dormitorio 2', 'Dormitory 2', 'dormitory', 1, 1);

-- 6 bunks per bedroom (bedroom 1 = bunks 1-6, bedroom 2 = bunks 7-12)
INSERT INTO hostel_bed_bunks (bedroom_id, bunk_number, display_order)
SELECT 1, n, n - 1 FROM generate_series(1, 6) AS n
UNION ALL
SELECT 2, n, n - 1 FROM generate_series(1, 6) AS n;

-- 2 beds (bottom/top) per bunk = 24 beds total
INSERT INTO hostel_beds (bunk_id, position, label)
SELECT bunk_id, position::hostel_bed_position, NULL
FROM generate_series(1, 12) AS bunk_id
CROSS JOIN (VALUES ('bottom'), ('top')) AS p(position);

-- ============================================================
-- Places: restaurants (from AreaEatPage.tsx)
--
-- NOT geocoded: these are placeholder/fictional businesses invented as
-- demo content (no place_addresses rows exist for them, and the original
-- AreaEatPage.tsx source explicitly documented their coordinates as
-- "invented offsets... not real geocoding"). Nominatim has nothing real to
-- resolve for a nonexistent business, so their coordinates stay as
-- approximate offsets from the hostel's (now-corrected) real location.
-- Replace with real coordinates once real local businesses are chosen.
-- ============================================================
INSERT INTO places (slug, category, name_es, name_en, short_description_es, short_description_en, description_markdown_es, description_markdown_en, icon_name, price_level, latitude, longitude, display_order) VALUES
  ('restaurante-el-camino', 'restaurant', 'Restaurante El Camino', 'Restaurante El Camino', 'Cocina tradicional extremeña', 'Traditional Extremaduran', 'Restaurante familiar con auténtica cocina de Extremadura.', 'Family-run restaurant serving authentic Extremadura cuisine.', 'utensils', 2, 39.0031, -6.3492, 0),
  ('bar-los-peregrinos', 'bar', 'Bar Los Peregrinos', 'Bar Los Peregrinos', 'Tapas y bar', 'Tapas & bar', 'Punto de encuentro popular entre peregrinos, tapas y bebidas económicas.', 'Popular pilgrim hangout with affordable tapas and drinks.', 'cocktail', 1, 39.0022, -6.3481, 1),
  ('meson-la-encina', 'restaurant', 'Mesón La Encina', 'Mesón La Encina', 'Cocina regional', 'Regional cuisine', 'Comedor de categoría superior con vinos locales e ingredientes de temporada.', 'Upscale dining featuring local wines and seasonal ingredients.', 'utensils', 3, 39.0035, -6.3502, 2),
  ('cafeteria-plaza', 'restaurant', 'Cafetería Plaza', 'Cafetería Plaza', 'Café y panadería', 'Café & bakery', 'Perfecta para desayunar antes de empezar tu etapa del Camino.', 'Perfect for breakfast before starting your day on the Camino.', 'utensils', 1, 39.0034, -6.3479, 3);

INSERT INTO place_labels (place_id, label_es, label_en, display_order) VALUES
  (1, 'Cerdo ibérico', 'Iberian pork', 0),
  (1, 'Quesos locales', 'Local cheese', 1),
  (1, 'Guisos tradicionales', 'Traditional stews', 2),
  (2, 'Tapas', 'Tapas', 0),
  (2, 'Bocadillos', 'Sandwiches', 1),
  (2, 'Menú del peregrino', 'Pilgrim menu', 2),
  (3, 'Carnes de caza', 'Game meats', 0),
  (3, 'Vinos regionales', 'Regional wines', 1),
  (3, 'Verduras de temporada', 'Seasonal vegetables', 2),
  (4, 'Bollería fresca', 'Fresh pastries', 0),
  (4, 'Café', 'Coffee', 1),
  (4, 'Desayunos', 'Breakfast', 2);

-- ============================================================
-- Places: trails, parks, excursions (from AreaVisitPage.tsx)
--
-- Same caveat as the restaurants above: these are demo/placeholder
-- activities with no real address, not geocoded for the same reason.
-- ============================================================
INSERT INTO places (slug, category, name_es, name_en, short_description_es, short_description_en, description_markdown_es, description_markdown_en, icon_name, latitude, longitude, display_order) VALUES
  ('paseo-casco-historico', 'trail', 'Paseo por el Casco Histórico', 'Historic Town Center Walk', 'Autoguiado · 1-2 horas', 'Self-guided · 1-2 hours', 'Explora las calles y edificios históricos de Carrascalejo a tu propio ritmo.', 'Explore the charming streets and historic buildings of Carrascalejo at your own pace.', 'compass', 39.0029, -6.3485, 0),
  ('ruta-camino-extendida', 'trail', 'Ruta del Camino Extendida', 'Camino Trail Extension', 'Circuito de 5 km · 2-3 horas', '5 km loop · 2-3 hours', 'Un precioso circuito por el campo que rodea la localidad.', 'A beautiful circular walk through the countryside surrounding the town.', 'compass', 39.0058, -6.3521, 1),
  ('mirador-atardecer', 'park', 'Mirador del Atardecer', 'Sunset Viewpoint', '1 km · 30 minutos', '1 km · 30 minutes', 'Un corto paseo hasta el mejor punto para ver la puesta de sol de la zona.', 'Short walk to the best sunset viewing spot in the area.', 'tree', 39.0011, -6.3455, 2),
  ('ruta-patrimonio-extremadura', 'excursion', 'Ruta del Patrimonio de Extremadura', 'Extremadura Heritage Tour', 'Guiado · Mín. 4 personas · 4 horas', 'Guided · Min. 4 people · 4 hours', 'Recorrido completo por los lugares históricos y culturales de la región con guía local.', 'Comprehensive tour of the region''s historical and cultural sites with a local expert.', 'monument', 39.0042, -6.3512, 3),
  ('experiencia-historica-camino', 'excursion', 'Experiencia Histórica del Camino', 'Camino History Experience', 'Guiado · Mín. 6 personas · 3 horas', 'Guided · Min. 6 people · 3 hours', 'Un recorrido profundo por la historia y el significado del Camino de Santiago en la región.', 'Deep dive into the history and significance of the Camino de Santiago in this region.', 'monument', 39.0038, -6.3468, 4),
  ('ruta-naturaleza-fauna', 'excursion', 'Ruta de Naturaleza y Fauna', 'Nature & Wildlife Trek', 'Guiado · Mín. 4 personas · 5 horas', 'Guided · Min. 4 people · 5 hours', 'Paseo guiado por el ecosistema único de Extremadura.', 'Guided nature walk through Extremadura''s unique ecosystem.', 'compass', 39.0067, -6.354, 5);

-- place_id 8/9/10 = the 3 guided excursions (ruta-patrimonio-extremadura,
-- experiencia-historica-camino, ruta-naturaleza-fauna); place_id 7
-- (mirador-atardecer) is free/self-guided and has no price row.
INSERT INTO place_prices (place_id, label_es, label_en, amount, display_order) VALUES
  (8, 'Por persona', 'Per person', 25.00, 0),
  (9, 'Por persona', 'Per person', 20.00, 0),
  (10, 'Por persona', 'Per person', 35.00, 0);

INSERT INTO place_labels (place_id, label_es, label_en, display_order) VALUES
  (5, 'Plaza Mayor', 'Plaza Mayor', 0),
  (5, 'Iglesia de San Pedro', 'Church of San Pedro', 1),
  (6, 'Olivares', 'Olive groves', 0),
  (6, 'Vistas panorámicas', 'Panoramic views', 1),
  (7, 'Vistas de 360°', '360° views', 0),
  (7, 'Fotografía', 'Photography', 1),
  (8, 'Ruinas romanas', 'Roman ruins', 0),
  (8, 'Castillo medieval', 'Medieval castle', 1),
  (9, 'Tradiciones del peregrino', 'Pilgrim traditions', 0),
  (9, 'Lugares históricos', 'Historical sites', 1),
  (10, 'Observación de aves', 'Bird watching', 0),
  (10, 'Flora autóctona', 'Native flora', 1);
