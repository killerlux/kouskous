# 🎨 Design Brief — Tunisian Taxi Platform

**Project**: Ride-Hailing Platform for Licensed Tunisian Taxis  
**Target Market**: Tunisia (Licensed taxis only, cash payments)  
**Platforms**: Admin Web, Mobile Driver App, Mobile Client App  
**Status**: Backend complete, frontend design needed

---

## 🎯 Project Overview

### What We're Building
A ride-hailing platform connecting licensed Tunisian taxi drivers with passengers. Unlike Uber, this is:
- **Licensed taxis only** (yellow/blue official taxis)
- **Cash-only payments** (no credit cards)
- **Local focus** (Tunisia-specific)
- **Admin-controlled** (deposit approvals, driver verification)

### Key Differentiators
- 🇹🇳 Tunisian identity (local, trusted, official)
- 💰 Cash-based economy
- 🚕 Official licensed taxis (not private cars)
- 👮 Government-compliant
- 🏦 La Poste deposit integration

---

## 👥 Target Users

### 1. **Passengers (Clients)**
- **Demographics**: 18-65 years, urban Tunisia
- **Tech Savvy**: Medium (must use smartphones)
- **Language**: French (primary), Arabic (secondary), some English
- **Pain Points**: 
  - Hard to find taxis during peak hours
  - Unclear pricing
  - Safety concerns
  - No way to track arrival
- **Goals**:
  - Quick ride booking
  - Know price upfront
  - Track driver arrival
  - Feel safe

### 2. **Drivers (Licensed Taxi Drivers)**
- **Demographics**: 25-60 years, mostly male
- **Tech Savvy**: Low to Medium
- **Language**: French (primary), Arabic (secondary)
- **Pain Points**:
  - Idle time between rides
  - Competition with street hailing
  - Cash management
  - Earnings tracking
- **Goals**:
  - More ride requests
  - Easy to use while driving
  - Clear earnings visibility
  - Simple deposit process

### 3. **Admins (Platform Operators)**
- **Demographics**: Office staff, managers
- **Tech Savvy**: Medium to High
- **Language**: French/Arabic bilingual (French primary)
- **Pain Points**:
  - Manual verification work
  - Fraud detection
  - Deposit approval workload
- **Goals**:
  - Efficient workflow
  - Clear decision-making tools
  - Audit trail visibility
  - Quick processing

---

## 🎨 Visual Identity (Charte Graphique)

### Brand Personality
- **Trustworthy**: Official, licensed, safe
- **Local**: Tunisian identity, not a foreign app
- **Modern**: Contemporary design, not outdated
- **Accessible**: Easy for all ages and tech levels
- **Professional**: Serious business, not playful

### Core Values to Communicate
1. **Safety** — Licensed drivers, tracked rides
2. **Transparency** — Clear pricing, honest dealings
3. **Tunisian** — Local first, by Tunisians for Tunisians
4. **Reliable** — Always available, always works
5. **Fair** — Good for drivers and passengers

---

## 🎨 Color Palette Recommendations

### Primary Colors
**Option A: Tunisian Heritage**
- **Primary**: Tunisia Red `#CE1126` (from flag)
- **Secondary**: Medina Gold `#D4AF37`
- **Accent**: Mediterranean Blue `#0077B6`
- **Rationale**: Connects to Tunisian flag and cultural identity

**Option B: Modern Taxi**
- **Primary**: Taxi Yellow `#FFD700`
- **Secondary**: Night Blue `#1E3A8A`
- **Accent**: Safety Green `#10B981`
- **Rationale**: Universal taxi recognition + modern tech

**Option C: Trust & Safety** (Recommended)
- **Primary**: Deep Blue `#0F4C81` (trust, stability)
- **Secondary**: Warm Amber `#F59E0B` (energy, warmth)
- **Accent**: Fresh Green `#059669` (success, go)
- **Neutral**: Cool Gray `#64748B`
- **Rationale**: Professional yet approachable

### Semantic Colors
- **Success**: Green `#10B981`
- **Warning**: Amber `#F59E0B`
- **Error**: Red `#EF4444`
- **Info**: Blue `#3B82F6`

### Background Colors
- **Light Background**: `#F8FAFC`
- **Dark Background**: `#0F172A`
- **Card Background**: `#FFFFFF`
- **Subtle Gray**: `#F1F5F9`

---

## 🔤 Typography

### Font Recommendations

**Option A: Modern French + Arabic** (Recommended)
- **Primary (French/Latin)**: `Inter` or `DM Sans`
- **Secondary (Arabic)**: `Cairo` or `Tajawal` (Google Fonts)
- **Rationale**: Modern, highly readable, free, excellent Latin support

**Option B: Professional**
- **Primary (French/Latin)**: `IBM Plex Sans`
- **Secondary (Arabic)**: `IBM Plex Sans Arabic`
- **Rationale**: Professional, consistent across languages, unified family

**Option C: Friendly** (Recommended for Mobile)
- **Primary (French/Latin)**: `Nunito Sans`
- **Secondary (Arabic)**: `Almarai` (clean, friendly)
- **Rationale**: Approachable, excellent readability on mobile

### Type Scale
```
Heading 1: 32px / 2rem (Bold)
Heading 2: 24px / 1.5rem (Bold)
Heading 3: 20px / 1.25rem (Semibold)
Body Large: 18px / 1.125rem (Regular)
Body: 16px / 1rem (Regular)
Body Small: 14px / 0.875rem (Regular)
Caption: 12px / 0.75rem (Regular)
```

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 📱 Design System Components

### Mobile Apps (Client + Driver)

#### **Core Components Needed**:

1. **Map Interface**
   - Full-screen map view (Google Maps)
   - Floating action buttons
   - Bottom sheet for details
   - Pickup/dropoff pins
   - Driver location marker
   - Route polyline

2. **Buttons**
   - Primary: Solid color, high contrast
   - Secondary: Outlined
   - Tertiary: Text only
   - Danger: Red for cancel/reject
   - Sizes: Small (32px), Medium (44px), Large (56px)
   - States: Default, Pressed, Disabled, Loading

3. **Cards**
   - Ride card (origin, destination, time, price)
   - Driver card (photo, name, rating, car info)
   - Earnings card (amount, period, status)
   - Deposit card (amount, status, receipt)
   - Shadow: Subtle, elevation-based

4. **Inputs**
   - Search location (with autocomplete)
   - Phone number input (RTL for Arabic)
   - OTP code input (6 digits, large)
   - Amount input (currency formatted)
   - Text area (for notes/reasons)

5. **Status Indicators**
   - Ride status badges (requested, assigned, started, etc.)
   - Lock indicator (for 1000 TND threshold)
   - Online/Offline toggle
   - Network status
   - GPS accuracy warning

6. **Navigation**
   - Bottom tab bar (4-5 items)
   - Floating action button (request ride)
   - Drawer menu (profile, settings)
   - Back button (RTL-aware)

7. **Feedback**
   - Loading spinners
   - Success/error toasts
   - Confirmation dialogs
   - Empty states
   - Error states

---

### Admin Web Dashboard

#### **Core Components Needed**:

1. **Layout**
   - Sidebar navigation (collapsible)
   - Top app bar (logo, user menu, notifications)
   - Content area (responsive grid)
   - Breadcrumbs
   - Footer

2. **Tables**
   - Deposits queue (sortable, filterable)
   - Drivers list (search, pagination)
   - Rides history (with status filters)
   - Responsive on mobile

3. **Data Visualization**
   - Ride count chart (daily/weekly)
   - Earnings overview (bar chart)
   - Driver status (pie chart)
   - Key metrics cards (total rides, active drivers, etc.)

4. **Forms**
   - Driver verification form
   - Deposit approval form
   - Admin notes textarea
   - File upload (receipt images)
   - Date range picker

5. **Modals**
   - Deposit detail view
   - Driver profile view
   - Confirmation dialogs
   - Image viewer (receipts)

6. **Badges & Pills**
   - Status indicators (pending, approved, rejected)
   - Role badges (admin, superadmin)
   - Priority markers (high, medium, low)

---

## 🖼️ Visual Style Guidelines

### Spacing System (8px base)
```
xxs: 4px
xs:  8px
sm:  12px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

### Border Radius
```
Small:  4px  (badges, chips)
Medium: 8px  (buttons, inputs)
Large:  12px (cards)
XLarge: 16px (modals)
Full:   9999px (pills, avatars)
```

### Shadows (Elevation)
```
Level 1: 0 1px 3px rgba(0,0,0,0.1)  (cards)
Level 2: 0 4px 6px rgba(0,0,0,0.1)  (dropdowns)
Level 3: 0 10px 15px rgba(0,0,0,0.1) (modals)
Level 4: 0 20px 25px rgba(0,0,0,0.15) (overlays)
```

### Icons
- **Library**: Heroicons, Lucide, or Phosphor Icons
- **Style**: Outline for most, Solid for selected states
- **Sizes**: 16px (small), 20px (medium), 24px (large), 32px (xlarge)
- **Color**: Inherit from parent or semantic colors

---

## 🌐 Localization Requirements

### Languages (Priority Order)
1. **French** (Primary) — LTR layout
2. **Arabic** (Secondary) — RTL layout
3. **English** (Optional) — LTR layout

### Localization Considerations
- **Default Language**: French (app starts in French)
- **Language Switcher**: Prominent in settings, option in login
- **RTL Support for Arabic**: 
  - Flip entire layout when Arabic is selected
  - Mirror icons where appropriate
  - Keep numbers LTR regardless of language (e.g., prices: 50 TND)
  - Keep maps LTR (universal convention)
  - Phone numbers always LTR

### Cultural Adaptations
- Use local currency (TND not $)
- 24-hour time format (common in Tunisia)
- Friday-Saturday weekend awareness
- Prayer time considerations (optional)
- Ramadan mode (optional, reduced notifications)

---

## 📐 Screen Sizes & Breakpoints

### Mobile Apps (Flutter)
- **Target**: iOS 12+ and Android 8+
- **Primary**: 375x667 (iPhone SE) to 428x926 (iPhone 14 Pro Max)
- **Android**: 360x640 to 412x915
- **Tablets**: 768x1024 (iPad) — low priority

### Admin Web (Next.js)
- **Mobile**: 375px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large**: 1280px+

---

## 🎬 Animations & Micro-interactions

### Principles
- **Purposeful**: Animations should aid understanding
- **Fast**: 200-300ms for most transitions
- **Smooth**: Easing curves (ease-in-out)
- **Subtle**: Not distracting

### Key Animations
1. **Ride Request**: Pulse on map, expanding circle
2. **Driver Accepted**: Success checkmark animation
3. **Loading**: Skeleton screens (not spinners everywhere)
4. **Transitions**: Fade + slide for screen changes
5. **Success**: Confetti or checkmark for deposit approval
6. **Lock Warning**: Gentle shake for 1000 TND warning

---

## 🚦 Key User Flows to Design

### **Client App**
1. **Onboarding** → Phone verification → Home
2. **Request Ride** → Set pickup → Set dropoff → Confirm → Wait for driver
3. **Active Ride** → Driver assigned → Driver arriving → In ride → Complete → Rate
4. **History** → View past rides

### **Driver App**
1. **Onboarding** → Phone verification → Document upload → Wait approval
2. **Go Online** → Toggle online → Wait for rides
3. **Accept Ride** → New request → Accept → Navigate → Pickup → Start → Complete → Cash payment
4. **Earnings Lock** → See warning at 900 TND → Locked at 1000 TND → Submit deposit → Wait approval → Unlocked
5. **Earnings** → View balance → View history

### **Admin Web**
1. **Login** → Phone verification → Dashboard
2. **Approve Driver** → Queue → View documents → Approve/Reject → Next
3. **Approve Deposit** → Queue (FIFO) → View receipt → Check amount → Approve/Reject → Driver unlocked
4. **Monitor** → Dashboard → View metrics → Investigate issues

---

## 🎯 Design Priorities

### Must Have (MVP)
- ✅ Clear, high-contrast UI (readability)
- ✅ Large touch targets (44px minimum)
- ✅ Simple navigation (max 2-3 taps to key actions)
- ✅ Bilingual support (Arabic + French)
- ✅ Offline state handling
- ✅ Loading states everywhere
- ✅ Error messages that help users

### Should Have (Phase 2)
- Dark mode (especially for drivers at night)
- Accessibility features (voice navigation)
- Animated transitions
- Advanced filters
- Rich notifications

### Nice to Have (Future)
- Custom map styling
- Voice commands
- Haptic feedback
- Advanced analytics dashboards
- Personalization

---

## 🛠️ Design Deliverables Needed

### For Developers
1. **Design System**
   - Color palette (with hex codes)
   - Typography scale (with font files)
   - Component library (buttons, inputs, cards, etc.)
   - Icon set
   - Spacing system
   - Shadow definitions

2. **Mobile Mockups** (Client + Driver)
   - Login/Onboarding (3-5 screens)
   - Main flows (10-15 screens each)
   - Empty states
   - Error states
   - Loading states
   - RTL versions for Arabic

3. **Admin Web Mockups**
   - Login (1 screen)
   - Dashboard (1 screen)
   - Deposit approval (2-3 screens)
   - Driver verification (2-3 screens)
   - Responsive versions (mobile, tablet, desktop)

4. **Assets**
   - Logo (SVG + PNG)
   - App icons (iOS + Android)
   - Splash screens
   - Empty state illustrations
   - Success/error illustrations
   - Favicon

5. **Documentation**
   - Design system guide (PDF or Figma)
   - Component usage guidelines
   - Spacing examples
   - Color usage rules
   - Typography rules
   - Do's and Don'ts

---

## 📦 Design Tools Recommended

### Option A: Figma (Recommended)
- **Pros**: Collaborative, web-based, great for handoff
- **Cons**: Requires subscription for full features
- **Export**: Design tokens, CSS, Flutter code

### Option B: Adobe XD
- **Pros**: Free, powerful prototyping
- **Cons**: Less popular, harder to share
- **Export**: Assets, specs

### Option C: Sketch + Zeplin
- **Pros**: Industry standard
- **Cons**: Mac only, expensive
- **Export**: Full developer handoff

**Recommendation**: **Figma** for collaboration and ease of use.

---

## 🎨 Brand Assets to Create

### Logo
- **Primary Logo**: Full name + icon
- **Secondary Logo**: Icon only (for app icon)
- **Monochrome**: Black and white versions
- **Formats**: SVG, PNG (multiple sizes)

### App Icons
- **iOS**: 1024x1024 (App Store), various sizes for device
- **Android**: Adaptive icon (foreground + background)
- **Notification Icon**: Monochrome, simple

### Marketing
- **Social Media**: Profile pictures, cover images
- **Print**: Business cards, vehicle stickers (optional)
- **Website**: Hero images, feature graphics

---

## ✅ Success Criteria

Your design is successful if:
- ✅ Grandma can book a ride (simplicity test)
- ✅ Driver can accept while driving (one-handed operation)
- ✅ Admin processes 50 deposits in 30 minutes (efficiency)
- ✅ Works in full sun (high contrast)
- ✅ Works with poor network (graceful degradation)
- ✅ Feels "Tunisian" not "foreign"
- ✅ Instills trust and safety

---

## 🚫 What to Avoid

- ❌ Cluttered interfaces (too much info)
- ❌ Tiny text (<14px)
- ❌ Small touch targets (<40px)
- ❌ Too many colors (stick to palette)
- ❌ Slow animations (>500ms)
- ❌ Generic stock photos
- ❌ English-only copy
- ❌ Ignoring RTL layout
- ❌ Assuming good internet
- ❌ Over-designed (keep it simple)

---

## 📚 Design Inspiration

### Similar Apps (Study These)
- **Bolt** — Clean, simple, effective
- **Careem** — Middle East focus, good RTL
- **Yassir** — North African, good localization
- **Grab** — Southeast Asia, cash-heavy markets

### Design Systems to Reference
- **Material Design 3** — Google's guidelines
- **Human Interface Guidelines** — Apple's iOS standards
- **Ant Design** — For admin dashboard
- **Tailwind UI** — For component patterns

---

## 🤝 Collaboration Process

### Phase 1: Discovery (1 week)
1. Review this brief
2. Competitor analysis
3. Create mood boards
4. Propose 2-3 color palette options
5. Select typography

### Phase 2: Design System (1 week)
1. Define components
2. Create Figma library
3. Document usage
4. Review with developers

### Phase 3: Mockups (2-3 weeks)
1. Sketch wireframes
2. High-fidelity mockups
3. Prototype key flows
4. User testing (optional)
5. Iterations based on feedback

### Phase 4: Handoff (1 week)
1. Export assets
2. Document specifications
3. Developer walkthrough
4. Support during implementation

---

## 📞 Questions for Designer

Please address these in your proposal:

1. **Experience**: Have you designed for RTL (Arabic) before?
2. **Platform**: Familiar with mobile app design (iOS/Android)?
3. **Process**: What's your typical design-to-dev handoff process?
4. **Tools**: Do you use Figma? Can you share previous design systems?
5. **Timeline**: How long for MVP mockups (3 apps)?
6. **Cost**: What's your rate? Fixed price or hourly?
7. **Availability**: Can you start immediately?
8. **References**: Can you share 2-3 similar projects?
9. **Revisions**: How many rounds of revisions included?
10. **Support**: Available during development phase for questions?

---

## 💰 Budget Guidance

### Design Agency (Tunisia)
- **Design System**: 2,000 - 4,000 TND
- **Mobile Apps (2 apps)**: 5,000 - 10,000 TND
- **Admin Web**: 3,000 - 5,000 TND
- **Total**: 10,000 - 20,000 TND

### Freelance Designer (Tunisia)
- **Design System**: 1,000 - 2,000 TND
- **Mobile Apps**: 3,000 - 6,000 TND
- **Admin Web**: 2,000 - 3,000 TND
- **Total**: 6,000 - 11,000 TND

### Design Template + Customization
- **Templates**: 500 - 1,000 TND
- **Customization**: 2,000 - 4,000 TND
- **Total**: 2,500 - 5,000 TND

**Recommendation**: Start with freelancer for MVP, upgrade later.

---

## 🎯 Acceptance Criteria

Before final approval, design must:
- ✅ Include complete design system documentation
- ✅ Cover all key screens (login → main flow → complete)
- ✅ Provide RTL versions
- ✅ Show mobile, tablet, desktop breakpoints (admin)
- ✅ Include all states (loading, error, empty, success)
- ✅ Export all assets in correct formats
- ✅ Be approved by project owner (you)
- ✅ Be feasible to implement with current tech stack

---

**Ready to bring your taxi platform to life with stunning design!** 🎨🚕

**Next Steps**: Share this brief with designers and select the best proposal.

