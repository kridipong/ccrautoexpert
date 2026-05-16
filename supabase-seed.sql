-- ============================================================
-- ccrautoexpert — Seed Data
-- ============================================================

-- ============================================================
-- CATEGORIES (mirroring superpart's 7 main + subcategories)
-- ============================================================
insert into categories (slug, name_th, name_en, parent_id, sort_order) values
-- Main categories
('engine-oil-fluids',      'น้ำมันเครื่องและของเหลว',        'Engine Oil & Fluids',          null, 1),
('body-parts',             'ชิ้นส่วนตัวถัง',                  'Body Parts',                   null, 2),
('chassis-brakes',         'ช่วงล่างและระบบเบรก',             'Chassis & Brakes',             null, 3),
('cooling-ac',             'ระบบระบายความร้อน',               'Cooling & AC',                 null, 4),
('engine-drivetrain',      'ระบบเครื่องยนต์และส่งกำลัง',      'Engine & Drivetrain',          null, 5),
('car-care-equipment',     'การดูแลรถยนต์และอุปกรณ์',         'Car Care & Equipment',         null, 6),
('tools-equipment',        'เครื่องมือช่างและอุปกรณ์',        'Tools & Equipment',            null, 7);

-- Subcategories — Engine Oil & Fluids (parent=1)
insert into categories (slug, name_th, name_en, parent_id, sort_order) values
('engine-oil',             'น้ำมันเครื่อง',                   'Engine Oil',                   1, 1),
('transmission-oil',       'น้ำมันเกียร์',                    'Transmission Oil',             1, 2),
('brake-fluid',            'น้ำมันเบรก',                      'Brake Fluid',                  1, 3),
('coolant',                'น้ำยาหล่อเย็น',                   'Coolant',                      1, 4);

-- Subcategories — Chassis & Brakes (parent=3)
insert into categories (slug, name_th, name_en, parent_id, sort_order) values
('brake-pads',             'ผ้าเบรก',                         'Brake Pads',                   3, 1),
('brake-discs',            'จานเบรก',                         'Brake Discs',                  3, 2),
('shock-absorbers',        'โช้คอัพ',                         'Shock Absorbers',              3, 3),
('wheel-bearings',         'ลูกปืนล้อ',                       'Wheel Bearings',               3, 4),
('cv-joints',              'เพลาขับ CV',                      'CV Joints & Axles',            3, 5),
('suspension-arms',        'ปีกนก / ลูกหมาก',                 'Suspension Arms & Ball Joints',3, 6),
('steering',               'ระบบพวงมาลัย',                    'Steering',                     3, 7);

-- Subcategories — Engine & Drivetrain (parent=5)
insert into categories (slug, name_th, name_en, parent_id, sort_order) values
('filters',                'กรองอากาศ / น้ำมัน',              'Filters',                      5, 1),
('spark-plugs',            'หัวเทียน',                        'Spark Plugs',                  5, 2),
('timing-belts',           'สายพาน',                          'Timing Belts & Chains',        5, 3),
('clutch',                 'คลัทช์',                          'Clutch',                       5, 4),
('sensors',                'เซ็นเซอร์',                       'Sensors',                      5, 5);

-- ============================================================
-- PART BRANDS
-- ============================================================
insert into part_brands (name, slug) values
('Koyo',        'koyo'),
('NSK',         'nsk'),
('GSP',         'gsp'),
('KYB',         'kyb'),
('Tokico',      'tokico'),
('Monroe',      'monroe'),
('Bosch',       'bosch'),
('NGK',         'ngk'),
('Denso',       'denso'),
('TRW',         'trw'),
('Brembo',      'brembo'),
('Akebono',     'akebono'),
('Exedy',       'exedy'),
('Gates',       'gates'),
('Continental', 'continental'),
('3M',          '3m'),
('Motul',       'motul'),
('Shell',       'shell'),
('Castrol',     'castrol'),
('Mobil',       'mobil'),
('PTT',         'ptt'),
('ENEOS',       'eneos'),
('Valvoline',   'valvoline'),
('Fuchs',       'fuchs'),
('Mann',        'mann'),
('Mahle',       'mahle'),
('Valeo',       'valeo'),
('SKF',         'skf'),
('FAG',         'fag'),
('NTN',         'ntn');

-- ============================================================
-- CAR BRANDS
-- ============================================================
insert into car_brands (name, slug) values
('Toyota',      'toyota'),
('Honda',       'honda'),
('Isuzu',       'isuzu'),
('Nissan',      'nissan'),
('Mazda',       'mazda'),
('Mitsubishi',  'mitsubishi'),
('Ford',        'ford'),
('Chevrolet',   'chevrolet'),
('Suzuki',      'suzuki'),
('Subaru',      'subaru'),
('BMW',         'bmw'),
('Mercedes-Benz','mercedes-benz'),
('Audi',        'audi'),
('Volkswagen',  'volkswagen'),
('Hyundai',     'hyundai'),
('Kia',         'kia'),
('MG',          'mg'),
('GWM',         'gwm'),
('BYD',         'byd'),
('Hino',        'hino'),
('Fuso',        'fuso'),
('Yamaha',      'yamaha');

-- ============================================================
-- CAR MODELS — Toyota
-- ============================================================
insert into car_models (car_brand_id, name, slug, model_code) values
((select id from car_brands where slug='toyota'), 'Vios',       'vios',       'NCP93/XP150'),
((select id from car_brands where slug='toyota'), 'Corolla',    'corolla',    'ZRE172'),
((select id from car_brands where slug='toyota'), 'Camry',      'camry',      'ACV51'),
((select id from car_brands where slug='toyota'), 'Yaris',      'yaris',      'NCP150'),
((select id from car_brands where slug='toyota'), 'Hilux Revo', 'hilux-revo', 'GUN125'),
((select id from car_brands where slug='toyota'), 'Fortuner',   'fortuner',   'GUN156'),
((select id from car_brands where slug='toyota'), 'Innova',     'innova',     'TGN40'),
((select id from car_brands where slug='toyota'), 'CHR',        'chr',        'ZYX10'),
((select id from car_brands where slug='toyota'), 'Altis',      'altis',      'ZZE122'),
((select id from car_brands where slug='toyota'), 'Prius',      'prius',      'ZVW30');

-- CAR MODELS — Honda
insert into car_models (car_brand_id, name, slug, model_code) values
((select id from car_brands where slug='honda'), 'Civic',      'civic',      'FC/FE'),
((select id from car_brands where slug='honda'), 'City',       'city',       'GM6'),
((select id from car_brands where slug='honda'), 'Jazz',       'jazz',       'GK5'),
((select id from car_brands where slug='honda'), 'CR-V',       'cr-v',       'RW'),
((select id from car_brands where slug='honda'), 'HR-V',       'hr-v',       'RU'),
((select id from car_brands where slug='honda'), 'Accord',     'accord',     'CL9');

-- CAR MODELS — Isuzu
insert into car_models (car_brand_id, name, slug, model_code) values
((select id from car_brands where slug='isuzu'), 'D-Max',      'd-max',      'TFR'),
((select id from car_brands where slug='isuzu'), 'MU-X',       'mu-x',       'RT50'),
((select id from car_brands where slug='isuzu'), 'Trooper',    'trooper',    'UBS');

-- CAR MODELS — Nissan
insert into car_models (car_brand_id, name, slug, model_code) values
((select id from car_brands where slug='nissan'), 'Navara',    'navara',     'D23'),
((select id from car_brands where slug='nissan'), 'Almera',    'almera',     'N17'),
((select id from car_brands where slug='nissan'), 'Terra',     'terra',      'P40'),
((select id from car_brands where slug='nissan'), 'March',     'march',      'K13');

-- CAR MODELS — Mazda
insert into car_models (car_brand_id, name, slug, model_code) values
((select id from car_brands where slug='mazda'), 'Mazda2',     'mazda2',     'DE'),
((select id from car_brands where slug='mazda'), 'Mazda3',     'mazda3',     'BM'),
((select id from car_brands where slug='mazda'), 'CX-5',       'cx-5',       'KE/KF'),
((select id from car_brands where slug='mazda'), 'BT-50',      'bt-50',      'UP');

-- CAR MODELS — Mitsubishi
insert into car_models (car_brand_id, name, slug, model_code) values
((select id from car_brands where slug='mitsubishi'), 'Triton',    'triton',    'MQ/MR'),
((select id from car_brands where slug='mitsubishi'), 'Pajero',    'pajero',    'NS/NT'),
((select id from car_brands where slug='mitsubishi'), 'Mirage',    'mirage',    'A05A'),
((select id from car_brands where slug='mitsubishi'), 'Outlander', 'outlander', 'CW');

-- ============================================================
-- DUMMY PRODUCTS (wheel bearings for Vios — matching superpart style)
-- ============================================================
insert into products (slug, name_th, name_en, price, compare_price, stock_qty, part_number, oem_number, brand_id, category_id, weight_kg, fits_lr, is_fast_shipping) values
(
  'wheel-bearing-rear-vios-koyo',
  'ลูกปืนล้อหลัง VIOS ปี 07-12 NCP93 KOYO ทั้งดุม',
  'Rear Wheel Bearing VIOS 2007-2012 NCP93 KOYO Hub Assembly',
  1700, 2616, 12,
  '3DACF026F-24HSFG', '42450-0D060',
  (select id from part_brands where slug='koyo'),
  (select id from categories where slug='wheel-bearings'),
  1.0, true, true
),
(
  'wheel-bearing-front-vios-nsk',
  'ลูกปืนล้อหน้า VIOS ปี 02-07 NCP42 NSK',
  'Front Wheel Bearing VIOS 2002-2007 NCP42 NSK',
  950, 1400, 8,
  'B35-108UR', '90369-35026',
  (select id from part_brands where slug='nsk'),
  (select id from categories where slug='wheel-bearings'),
  0.4, true, false
),
(
  'wheel-bearing-rear-vios-gsp',
  'ลูกปืนล้อหลัง VIOS ปี 13-22 XP150 GSP ทั้งดุม',
  'Rear Wheel Bearing VIOS 2013-2022 XP150 GSP Hub Assembly',
  1550, 2200, 5,
  'GHA361002', '42450-0D100',
  (select id from part_brands where slug='gsp'),
  (select id from categories where slug='wheel-bearings'),
  1.1, true, true
),
(
  'brake-pad-front-vios-akebono',
  'ผ้าเบรกหน้า VIOS ปี 13-22 Akebono',
  'Front Brake Pads VIOS 2013-2022 Akebono',
  790, 1100, 20,
  'AN-674WK', '04465-0D170',
  (select id from part_brands where slug='akebono'),
  (select id from categories where slug='brake-pads'),
  0.6, false, true
),
(
  'shock-absorber-front-civic-kyb',
  'โช้คอัพหน้า Civic FC ปี 16-21 KYB Excel-G',
  'Front Shock Absorber Civic FC 2016-2021 KYB Excel-G',
  2200, 2900, 6,
  '339377', '51605-TBA-A01',
  (select id from part_brands where slug='kyb'),
  (select id from categories where slug='shock-absorbers'),
  2.5, false, false
),
(
  'oil-filter-toyota-mann',
  'กรองน้ำมันเครื่อง Toyota 1NZ/2NZ/1ZZ Mann',
  'Oil Filter Toyota 1NZ/2NZ/1ZZ Mann',
  180, 250, 50,
  'W712/83', '90915-YZZD3',
  (select id from part_brands where slug='mann'),
  (select id from categories where slug='filters'),
  0.2, false, true
),
(
  'spark-plug-ngk-iridium-vios',
  'หัวเทียน NGK Iridium VIOS / YARIS 1NZ-FE',
  'NGK Iridium Spark Plug VIOS / YARIS 1NZ-FE',
  320, 420, 100,
  'ILFR5A-11', '90919-01253',
  (select id from part_brands where slug='ngk'),
  (select id from categories where slug='spark-plugs'),
  0.1, false, true
),
(
  'cv-joint-front-d-max-gsp',
  'เพลาขับหน้า Isuzu D-Max ปี 12-19 GSP',
  'Front CV Axle Shaft Isuzu D-Max 2012-2019 GSP',
  3800, 5200, 4,
  'NI-8-97943453-0', '8-97943453-0',
  (select id from part_brands where slug='gsp'),
  (select id from categories where slug='cv-joints'),
  3.2, false, false
);

-- ============================================================
-- FITMENTS
-- ============================================================
insert into fitments (product_id, car_model_id, year_from, year_to, note_th, note_en) values
-- Koyo rear bearing → Vios 2007-2012
(
  (select id from products where slug='wheel-bearing-rear-vios-koyo'),
  (select id from car_models where slug='vios'),
  2007, 2012,
  'ใส่ได้ทั้งซ้ายและขวา', 'Fits both left and right'
),
-- NSK front bearing → Vios 2002-2007
(
  (select id from products where slug='wheel-bearing-front-vios-nsk'),
  (select id from car_models where slug='vios'),
  2002, 2007,
  'ใส่ได้ทั้งซ้ายและขวา', 'Fits both left and right'
),
-- GSP rear bearing → Vios 2013-2022
(
  (select id from products where slug='wheel-bearing-rear-vios-gsp'),
  (select id from car_models where slug='vios'),
  2013, 2022,
  'ใส่ได้ทั้งซ้ายและขวา', 'Fits both left and right'
),
-- Akebono brake pads → Vios 2013-2022
(
  (select id from products where slug='brake-pad-front-vios-akebono'),
  (select id from car_models where slug='vios'),
  2013, 2022,
  null, null
),
-- KYB shock → Civic FC 2016-2021
(
  (select id from products where slug='shock-absorber-front-civic-kyb'),
  (select id from car_models where slug='civic'),
  2016, 2021,
  'ด้านหน้าซ้ายหรือขวา', 'Front left or right'
),
-- Mann oil filter → Vios + Yaris + Altis (1NZ/2NZ/1ZZ)
(
  (select id from products where slug='oil-filter-toyota-mann'),
  (select id from car_models where slug='vios'),
  2002, 2022, null, null
),
(
  (select id from products where slug='oil-filter-toyota-mann'),
  (select id from car_models where slug='yaris'),
  2006, 2022, null, null
),
(
  (select id from products where slug='oil-filter-toyota-mann'),
  (select id from car_models where slug='altis'),
  2001, 2014, null, null
),
-- NGK spark plug → Vios + Yaris
(
  (select id from products where slug='spark-plug-ngk-iridium-vios'),
  (select id from car_models where slug='vios'),
  2002, 2022, null, null
),
(
  (select id from products where slug='spark-plug-ngk-iridium-vios'),
  (select id from car_models where slug='yaris'),
  2006, 2022, null, null
),
-- GSP CV joint → D-Max 2012-2019
(
  (select id from products where slug='cv-joint-front-d-max-gsp'),
  (select id from car_models where slug='d-max'),
  2012, 2019,
  'เพลาซ้ายหรือขวา', 'Left or right shaft'
);
