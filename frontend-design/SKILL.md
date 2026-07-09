---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. Just like a human designer who's hired, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the human's design brief: create a compact token system with color, type, layout, and signature. Color: describe the palette as 4–6 named hex values. Type: the typefaces for 2+ roles (a characterful display face that's used with restraint, a complementary body face, and a utility face for captions or data if needed). Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Signature: the single unique element this page will be remembered by that embodies the brief in an appropriate way.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan exactly and deriving every color and type decision from it.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and a element-based selector like .cta). This can happen often with paddings/margins between sections.

Try to do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Not taking a risk can be a risk itself! Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots if your environment supports it – a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creators have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand, and therefore easier to use. They are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.

## Design-Engineering Prinicples (Rules To follow in each design)

## 1.1 Baseline Configuration

DialDefaultRangeDESIGN_VARIANCE81=Symmetry, 10=AsymmetricMOTION_INTENSITY61=Static, 10=CinematicVISUAL_DENSITY41=Airy, 10=Packed

Adapt dynamically based on user requests.

## 1.2 Architecture Conventions

- **DEPENDENCY VERIFICATION:** Check package.json before importing any library. Output install command if missing.
- **Framework:** React/Next.js. Default to Server Components. Interactive components must be isolated "use client" leaf components.
- **Styling:** Tailwind CSS. Check version in package.json — NEVER mix v3/v4 syntax.
- **ANTI-EMOJI POLICY:** NEVER use emojis anywhere. Use Phosphor or Radix icons only.
- **Viewport:** Use min-h-\[100dvh\] not h-screen. Use CSS Grid not flex percentage math.
- **Layout:** max-w-\[1400px\] mx-auto or max-w-7xl.

## 1.3 Design Rules

RuleDirectiveTypographyHeadlines: text-4xl md:text-6xl tracking-tighter. Body: text-base leading-relaxed max-w-\[65ch\]. **NEVER** use Inter — use Geist/Outfit/Satoshi. **NEVER** use Serif on dashboards.ColorMax 1 accent, saturation < 80%. **NEVER** use AI purple/blue. Stick to one palette.Layout**NEVER** use centered heroes when VARIANCE > 4. Force split-screen or asymmetric layouts.Cards**NEVER** use generic cards when DENSITY > 7. Use border-t, divide-y, or spacing.States**ALWAYS** implement: Loading (skeleton), Empty, Error, Tactile feedback (scale-\[0.98\]).FormsLabel above input. Error below. gap-2 for input blocks.

## 1.4 Anti-Slop Techniques

- **Liquid Glass:** backdrop-blur + border-white/10 + shadow-\[inset_0_1px_0_rgba(255,255,255,0.1)\]
- **Magnetic Buttons:** Use useMotionValue/useTransform — never useState for continuous animations
- **Perpetual Motion:** When INTENSITY > 5, add infinite micro-animations (Pulse, Float, Shimmer)
- **Layout Transitions:** Use Framer layout and layoutId props
- **Stagger:** Use staggerChildren or CSS animation-delay: calc(var(--index) \* 100ms)

## 1.5 Forbidden Patterns

CategoryBannedVisualNeon glows, pure black (#000), oversaturated accents, gradient text on headers, custom cursorsTypographyInter font, oversized H1s, Serif on dashboardsLayout3-column equal card rows, floating elements with awkward gapsComponentsDefault shadcn/ui without customization

## 1.6 Creative Arsenal

CategoryPatternsNavigationDock magnification, Magnetic button, Gooey menu, Dynamic island, Radial menu, Speed dial, Mega menuLayoutBento grid, Masonry, Chroma grid, Split-screen scroll, Curtain revealCardsParallax tilt, Spotlight border, Glassmorphism, Holographic foil, Swipe stack, Morphing modalScrollSticky stack, Horizontal hijack, Locomotive sequence, Zoom parallax, Progress path, Liquid swipeGalleryDome gallery, Coverflow, Drag-to-pan, Accordion slider, Hover trail, Glitch effectTextKinetic marquee, Text mask reveal, Scramble effect, Circular path, Gradient stroke, Kinetic gridMicroParticle explosion, Pull-to-refresh, Skeleton shimmer, Directional hover, Ripple click, SVG draw, Mesh gradient, Lens blur

## 1.7 Bento Paradigm

- **Palette:** Background #f9fafb, cards pure white with border-slate-200/50
- **Surfaces:** rounded-\[2.5rem\], diffusion shadow
- **Typography:** Geist/Satoshi, tracking-tight headers
- **Labels:** Outside and below cards
- **Animation:** Spring physics (stiffness: 100, damping: 20), infinite loops, React.memo isolation

**5-Card Archetypes:**

1.  Intelligent List — auto-sorting with layoutId
2.  Command Input — typewriter + blinking cursor
3.  Live Status — breathing indicators
4.  Wide Data Stream — infinite horizontal carousel
5.  Contextual UI — staggered highlight + float-in toolbar

## 1.8 Brand Override

When brand styling is active:

- Dark: #141413, Light: #faf9f5, Mid: #b0aea5, Subtle: #e8e6dc
- Accents: Orange #d97757, Blue #6a9bcc, Green #788c5d
- Fonts: Poppins (headings), Lora (body)

# 2\. Motion Engine

## 2.1 Tool Selection Matrix

NeedToolUI enter/exit/layout**Framer Motion** — AnimatePresence, layoutId, springsScroll storytelling (pin, scrub)**GSAP + ScrollTrigger** — frame-accurate controlLooping icons**Lottie** — lazy-load (~50KB)3D/WebGL**Three.js / R3F** — isolated

, own "use client" boundaryHover/focus states**CSS only** — zero JS costNative scroll-driven**CSS** — animation-timeline: scroll()

**Conflict Rules \[MANDATORY\]:**

- NEVER mix GSAP + Framer Motion in same component
- R3F MUST live in isolated Canvas wrapper
- ALWAYS lazy-load Lottie, GSAP, Three.js

## 2.2 Intensity Scale

LevelTechniques1-2 SubtleCSS transitions only, 150-300ms3-4 SmoothCSS keyframes + Framer animate, stagger ≤3 items5-6 FluidwhileInView, magnetic hover, parallax tilt7-8 CinematicGSAP ScrollTrigger, pinned sections, horizontal hijack9-10 ImmersiveFull scroll sequences, Three.js particles, WebGL shaders

## 2.3 Animation Recipes

See references/motion-recipes.md for full code. Summary:

RecipeToolUse ForScroll RevealFramerFade+slide on viewport entryStagger GridFramerSequential list animationsPinned TimelineGSAPHorizontal scroll with pinningTilt CardFramerMouse-tracking 3D perspectiveMagnetic ButtonFramerCursor-attracted buttonsText ScrambleVanillaMatrix-style decode effectSVG Path DrawCSSScroll-linked path animationHorizontal ScrollGSAPVertical-to-horizontal hijackParticle BackgroundR3FDecorative WebGL particlesLayout MorphFramerCard-to-modal expansion

## 2.4 Performance Rules

**GPU-only properties (ONLY animate these):** transform, opacity, filter, clip-path

**NEVER animate:** width, height, top, left, margin, padding, font-size — if you need these effects, use transform: scale() or clip-path instead.

**Isolation:**

- Perpetual animations MUST be in React.memo leaf components
- will-change: transform ONLY during animation
- contain: layout style paint on heavy containers

**Mobile:**

- ALWAYS respect prefers-reduced-motion
- ALWAYS disable parallax/3D on pointer: coarse
- Cap particles: desktop 800, tablet 300, mobile 100
- Disable GSAP pin on mobile < 768px

**Cleanup:** Every useEffect with GSAP/observers MUST return () => ctx.revert()

## 2.5 Springs & Easings

FeelFramer ConfigSnappystiffness: 300, damping: 30Smoothstiffness: 150, damping: 20Bouncystiffness: 100, damping: 10Heavystiffness: 60, damping: 20CSS EasingValueSmooth decelcubic-bezier(0.16, 1, 0.3, 1)Smooth accelcubic-bezier(0.7, 0, 0.84, 0)Elasticcubic-bezier(0.34, 1.56, 0.64, 1)

## 2.6 Accessibility

- ALWAYS wrap motion in prefers-reduced-motion check
- NEVER flash content > 3 times/second (seizure risk)
- ALWAYS provide visible focus rings (use outline not box-shadow)
- ALWAYS add aria-live="polite" for dynamically revealed content
- ALWAYS include pause button for auto-playing animations

## 2.7 Dependencies

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install framer-motion           # UI (keep at top level)  npm install gsap                    # Scroll (lazy-load)  npm install lottie-react            # Icons (lazy-load)  npm install three @react-three/fiber @react-three/drei  # 3D (lazy-load)   `
