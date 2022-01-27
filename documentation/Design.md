# Design

When designing lume, we set out to create a decent yet joyful experience for our users.

In the beginning, we tried to set some of the ground rules, which every aspect of lume's design should adhere to:
lume should not feel alien to any platform that it runs on.
There should not be any unnecessary distractions to the user.
lume should be accessible and easy to use for everyone.
Every icon or font face or design element needs to have a bit of a joyful touch.

In order to follow these policies, we decided to rely heavily on two things: gradients and iconography.

We then began designing the core of the app: the fire screen.
A gradient dominates the Background of the fire screen. We use this further to convey the state of the user's fire. In order to stay in line with accessibility and legibility, we chose to fade the colour to a neutral light grey. This neutral grey ensures that the title at the top of the screen prompting the user to receive or share their fire is always legible.

## Colours

At this point in the design process, it was crucial to dial in the colours of the lume app.

Our app has something to do with an Olympic torch, we choose an intense red as our primary accent.

![](https://dummyimage.com/50x50/FF3A3A&text=.) Lume Primary Color

We consulted industry-standard colour psychologies guidelines when choosing the rest of our colours.
We chose a rich purple as our secondary colour. We use this colour in places where the fire is turned of. Therefore purples `ambition` characteristics were just the right fit.

![](https://dummyimage.com/50x50/6F3FAF&text=.) Lume Secondary Color

As our background colours, we chose a simple off-white representing simplicity and elegance, which we wanted to achieve.
We chose black for text for contrast reasons, as all backgrounds are bright colours.

## Icons

We then began creating the icons needed for our app. We began with the flame.
<img src=https://raw.githubusercontent.com/hsrm-lume/react-native-cli-lume/main/src/assets/fire.svg style="width:100px"/>

As many apps use flames as icons (most notably Tinder), we wanted to differentiate our flame from other apps. Differentiating was especially important, as lume should not make people think of another app. We, therefore, chose a three-headed flame with one primary and two secondary fires. We also used a gradient to achieve the signature lume look inside the flame. To make the flame portray a little more fun, we added a small flame in white at the centre of the flame, which loosely adheres to the shape of the outer flame.

We then created the torch.

<img src=https://raw.githubusercontent.com/hsrm-lume/react-native-cli-lume/main/src/assets/torch.svg style="width:100px"/>

As it needed to bring up the image of a torch in the heads of our users, we created a simple torch shape. Again, we employed our gradient policy, which meant using base colours and shifting slightly away from them over the shape they cover.

Going over to our map icon, we see another often-used pattern throughout the app's design.

<img src=https://raw.githubusercontent.com/hsrm-lume/react-native-cli-lume/main/src/assets/map.svg style="width:100px"/>

If there is no real need to use specific colours for an object, we use the primary and secondary colours at a 60° angle over the icon's main shape.

Going over our app, one can see these principles applied all over the app.

Regarding the app's general structure, we wanted to create a unified look for the app. This meant we chose the Bottom Navigator as it is native to iOS and Android.

### WebApp

Concerning the Web App, the implementation of the design was a little easier. This required: creating an Angular Design sheet, modifying some of the overlays and bringing in the icons

### Full Design file

In order to create the design Adobe XD was used. The design file is located [here](lume.xd).
