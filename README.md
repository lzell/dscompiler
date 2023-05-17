## About

DesignSystemCompiler compiles design system tokens defined in Figma into named
constants in Swift. Tokens are emitted as if a swift engineer coded them.

Using this project will:

1. Give the design team more control of production design.
2. Eliminate divergence in design atoms between the design file and the frontend implementation.
3. Reduce competition for engineering time.

This project is a continuation of the [figmatoswift](https://figmatoswift.com) project.
If you have questions, want support or have feedback to offer, please reach out
to [Todd](https://toddham.com) for design or [me](https://github.com/lzell) for
engineering (my email is in my github profile).

## How is this different from other projects?

1. We emit code only for the design system, not the full design.

  Other tools want to go straight from design to deployed code, an approach that
  is too necessarily limiting on the types of apps that can be created.
  Businesses run on complex rules, and engineers are required to turn those rules
  into coded logic.

2. We don't try to bypass engineering.

  Instead of bypassing engineering, we generate code to be used by engineering.
  The code we emit looks and feels as if it was written by an experienced
  frontend engineer. Engineering integrates the emitted design tokens into the
  frontend codebase for the app or website. Once integrated, the design team
  can then make changes to the design (adjusting colors, fonts, etc.) without
  requesting time from engineering.

  To see how this works, imagine the design system has a color called
  `primary`. A frontend engineer is required to integrate usages of
  `Color.primary` (i.e. the token that we emit) into the codebase. Then,
  designers can play with the meaning of `Color.primary` without support from
  engineering. They can adjust the color behind `Color.primary`, compile the
  design system, and see their changes immediately in development versions of
  the app. Engineering is required to deploy these changes to production.

3. We build in the open.

   DesignSystemCompiler has an open, extensible architecture. Contributors can add
   support for other design tools or targeting different frontends. Customers
   can look under the hood and see that nothing unexpected is happening with
   their data.


## How does this project prevent design errors in production?

The status quo is to handoff design system files from designer to engineer.
The engineer then codes up a (hopefully) identical copy of the designer's work.
The work is performed twice, and there are now two sources of truth: the design
files and the frontend implementation. Over time, both of these can and do
change independently of the other, leading to divergence between what the
design team intended and what the customers experience. [1]

A better way is to let the designers compile the named tokens and have
engineering work with the generated tokens. Engineering should never be using a
color picker or inspecting the font type of a design file. Once the named
tokens are integrated into the codebase, designers can adjust the values behind
the tokens without engineering's help.


[1] At a once-unicorn company that I worked at, I grepped the frontend to find
over three hundred different colors. Certainly not what the design team had in mind.
