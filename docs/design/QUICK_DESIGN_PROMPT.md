# 🎨 Quick Design Prompt — Tunisian Taxi Platform UI/UX

**Use this prompt with AI design tools (MidJourney, DALL-E) or as a quick brief for designers.**

---

## 📱 Project Overview

Design a **modern ride-hailing platform UI** for licensed Tunisian taxis (not Uber).

**Key Differences**:
- Licensed taxis only (official yellow/blue taxis)
- Cash-only payments (no credit cards)
- Tunisia-specific (local identity)
- Admin approval workflow (deposits, driver verification)

---

## 🎨 Visual Identity

### Brand Personality
**Professional • Trustworthy • Tunisian • Modern • Accessible**

### Recommended Color Palette
```
Primary:   Deep Blue #0F4C81 (trust, stability)
Secondary: Warm Amber #F59E0B (energy, warmth)
Accent:    Fresh Green #059669 (success)
Neutral:   Cool Gray #64748B
Background: Soft White #F8FAFC
```

**Alternative**: Tunisia flag colors (Red #CE1126 + Gold #D4AF37)

### Typography
- **Arabic**: Almarai or Cairo (Google Fonts)
- **Latin**: Inter or Nunito Sans
- **Weights**: Regular (400), Semibold (600), Bold (700)

---

## 📱 Apps to Design

### 1. **Mobile Client App** (Passenger)
**Key Screens**:
- Phone login (OTP)
- Map view (request ride)
- Driver arriving (ETA, driver info)
- Active ride (live tracking)
- Ride complete (cash payment confirmation)
- History

**Style**: Clean, simple, high-contrast, large touch targets

---

### 2. **Mobile Driver App**
**Key Screens**:
- Phone login + document upload
- Dashboard (go online/offline)
- Ride request (accept/decline)
- Active ride (navigation integration)
- Earnings display
- **Lock warning** (at 1000 TND threshold)
- Deposit submission (upload receipt photo)

**Style**: Easy to use while driving, one-handed operation

---

### 3. **Admin Web Dashboard**
**Key Screens**:
- Login
- Dashboard (metrics, charts)
- **Deposit approval queue** (FIFO, with receipt viewer)
- Driver verification queue
- Ride monitoring

**Style**: Professional, data-dense but organized, efficient workflow

---

## 🎯 Key UI Components

### Must-Have Components
1. **Map Interface** — Full-screen, floating buttons, bottom sheet
2. **Ride Card** — Origin, destination, time, price, driver info
3. **Status Badges** — Requested, Assigned, Started, Completed
4. **Big Action Button** — "Request Ride", "Accept", "Go Online"
5. **Earnings Card** — Current balance, warning at 900 TND, **locked at 1000 TND**
6. **Deposit Flow** — Upload receipt → Pending → Approved/Rejected
7. **Phone Input** — RTL support, Tunisia +216 prefix
8. **OTP Input** — 6 large boxes

---

## 🌍 Localization

- **Primary Language**: Arabic (RTL layout)
- **Secondary**: French (LTR)
- **RTL Requirements**: Flip entire layout, mirror icons, keep numbers LTR
- **Cultural**: Use TND currency, 24h time, Friday-Saturday weekend

---

## ✨ Design Priorities

### Must Have
- ✅ **High contrast** (readable in sunlight)
- ✅ **Large touch targets** (44px minimum)
- ✅ **Simple navigation** (max 3 taps to main actions)
- ✅ **Loading states** (skeleton screens)
- ✅ **Error states** (helpful messages)
- ✅ **Empty states** (friendly illustrations)

### Nice to Have
- Dark mode (for night driving)
- Animations (smooth, 200-300ms)
- Haptic feedback
- Pull-to-refresh

---

## 🚫 What to Avoid

- ❌ Tiny text (<14px)
- ❌ Cluttered interface
- ❌ Too many colors
- ❌ Slow animations (>500ms)
- ❌ English-only
- ❌ Ignoring RTL
- ❌ Generic stock photos

---

## 🎨 AI Design Tool Prompts

### For MidJourney / DALL-E

**Mobile App Home Screen**:
```
Modern ride-hailing mobile app UI, clean minimalist design, 
full-screen map interface with floating action button, 
bottom sheet with pickup and dropoff location, 
blue and amber color scheme, Arabic text, RTL layout, 
professional and trustworthy feel, iOS design style, 
high contrast, --ar 9:19
```

**Driver Earnings Screen**:
```
Mobile app earnings dashboard, large balance display showing 
850 TND with progress bar to 1000 TND threshold, 
amber warning badge, transaction history list, 
card-based layout, modern fintech UI style, 
Arabic interface RTL, deep blue and amber colors, --ar 9:19
```

**Admin Deposit Approval**:
```
Web dashboard for deposit approval, FIFO queue table with 
driver photos and receipt thumbnails, clean data table, 
approve/reject action buttons, sidebar navigation, 
professional admin interface, blue and gray color scheme, 
desktop layout, modern SaaS UI, --ar 16:9
```

**Lock Warning Screen**:
```
Mobile alert screen showing driver account locked at 1000 TND, 
large lock icon, warning message in Arabic, 
"Submit Deposit" call-to-action button, 
amber warning color, friendly but urgent tone, 
modern app UI, centered content, --ar 9:19
```

---

## 📐 Screen Specifications

### Mobile (Flutter)
- **Target Size**: 375x667 to 428x926
- **Safe Areas**: Account for notches and home bars
- **Touch Targets**: Minimum 44x44 pt

### Web (Next.js)
- **Breakpoints**: 375px, 768px, 1024px, 1280px
- **Max Width**: 1440px content
- **Sidebar**: 256px collapsed, 320px expanded

---

## 🎯 Success Criteria

Design is successful if:
- ✅ Grandma can book a ride (simplicity)
- ✅ Driver can use one-handed while driving
- ✅ Admin can process deposits quickly
- ✅ Works in bright sunlight (contrast)
- ✅ Feels Tunisian, not foreign
- ✅ Instills trust and safety

---

## 📦 Deliverables Needed

1. **Design System** (colors, fonts, components)
2. **Mobile Mockups** — 10-15 key screens per app
3. **Admin Mockups** — 5-8 key screens
4. **Assets** — Logo, app icons, illustrations
5. **RTL Versions** — All screens in Arabic
6. **Responsive** — Mobile/tablet/desktop for admin

**Format**: Figma file preferred (for easy developer handoff)

---

## 🚀 Quick Start

### Option 1: Hire Designer
Use this as brief, expect:
- **Timeline**: 3-4 weeks
- **Cost**: 6,000-11,000 TND (Tunisia)
- **Deliverables**: Complete UI kit + mockups

### Option 2: Use Template + Customize
1. Find ride-hailing template (ThemeForest, Flutter templates)
2. Customize colors and branding
3. Add Tunisia-specific features
4. **Cost**: 2,500-5,000 TND

### Option 3: DIY with AI Tools
1. Generate screens with MidJourney using prompts above
2. Compile in Figma
3. Refine and adapt
4. **Cost**: ~500 TND + your time

---

## 🎨 Design Inspiration

**Apps to Study**:
- Bolt (clean, simple)
- Careem (Arabic, RTL)
- Yassir (North African)

**Design Systems**:
- Material Design 3
- iOS Human Interface Guidelines
- Ant Design (for admin)

---

## 📞 Need Help?

- Full design brief: `/docs/design/DESIGN_BRIEF.md`
- Technical specs: `/docs/ARCHITECTURE.md`
- API endpoints: `/docs/openapi.yaml`

---

**Ready to create beautiful, functional designs for your taxi platform!** 🎨🚕

