# iOS-Study
2013--iOS7--Standford CS193p



Jul 11, 2014

# [Welcome to Swift Blog](https://developer.apple.com/swift/blog/?id=1)

This new blog will bring you a behind-the-scenes look into the design of the Swift language by the engineers who created it, in addition to the latest news and hints to turn you into a productive Swift programmer.

Get started with Swift by downloading [Xcode 6 beta](https://developer.apple.com/xcode/), now available to all Registered Apple Developers for free. The Swift Resources tab has a ton of great links to videos, documentation, books, and sample code to help you become one of the world’s first Swift experts. There’s never been a better time to get coding!



Jul 11, 2014

# [Compatibility](https://developer.apple.com/swift/blog/?id=2)

One of the most common questions we heard at WWDC was, “What is the compatibility story for Swift?”. This seems like a great first topic.

### App Compatibility

Simply put, if you write a Swift app today and submit it to the App Store this Fall when iOS 8 and OS X Yosemiteare released, you can trust that your app will work well into the future. In fact, you can target back to OS X Mavericks or iOS 7 with that same app. This is possible because Xcode embeds a small Swift runtime library within your app’s bundle. Because the library is embedded, your app uses a consistent version of Swift that runs on past, present, and future OS releases.

### Binary Compatibility and Frameworks

While your app’s runtime compatibility is ensured, the Swift language itself will continue to evolve, and the binary interface will also change. To be safe, all components of your app should be built with the same version of Xcode and the Swift compiler to ensure that they work together.

This means that frameworks need to be managed carefully. For instance, if your project uses frameworks to share code with an embedded extension, you will want to build the frameworks, app, and extensions together. It would be dangerous to rely upon binary frameworks that use Swift — especially from third parties. As Swift changes, those frameworks will be incompatible with the rest of your app. When the binary interface stabilizes in a year or two, the Swift runtime will become part of the host OS and this limitation will no longer exist.

### Source Compatibility

Swift is ready to use today, in brand new apps or alongside your proven Objective-C code. We have big plans for the Swift language, including improvements to syntax, and powerful new features. And as Swift evolves, we will provide tools in Xcode to help you migrate your source code forward.

We can’t wait to see what you build!



Jul 15, 2014

# [Swift Language Changes in Xcode 6 beta 3](https://developer.apple.com/swift/blog/?id=3)

The Swift programming language continues to advance with each new Xcode 6 beta, including new features, syntax enhancements, and behavioral refinements. Xcode 6 beta 3 incorporates some important changes, a few of which we’d like to highlight:

- Array has been completely redesigned to have full value semantics to match the behavior of Dictionary and String. Now a let array is completely immutable, and a var array is completely mutable.
- Syntax “sugar” for Array and Dictionary has changed. Arrays are declared using [Int] as short hand for Array<Int>, instead of Int[]. Similarly, Dictionary uses [Key: Value] for Dictionary<Key, Value>.
- The half-open range operator has been changed from .. to ..< to make it more clear alongside the ...operator for closed ranges.

Xcode 6 beta is free to Registered Apple Developers and can be downloaded on the [Xcode downloads page](https://developer.apple.com/xcode/downloads/). Read all about these and other changes in the complete [release notes for Xcode 6 beta 3.](https://developer.apple.com/library/prerelease/ios/releasenotes/DeveloperTools/RN-Xcode/)





Jul 18, 2014

# [Building assert() in Swift, Part 1: Lazy Evaluation](https://developer.apple.com/swift/blog/?id=4)

UPDATE: This post has been updated to reflect a change in Xcode 6 beta 5 that renamed @auto_closure to @autoclosure, and LogicValue to BooleanType.

When designing Swift we made a key decision to do away with the C preprocessor, eliminating bugs and making code much easier to understand. This is a big win for developers, but it also means Swift needs to implement some old features in new ways. Most of these features are obvious (importing modules, conditional compilation), but perhaps the most interesting one is how Swift supports macros like assert().

When building for release in C, the assert() macro has no runtime performance impact because it doesn’t evaluate any arguments. One popular implementation in C looks like this:

```swift
#ifdef NDEBUG
#define assert(e)  ((void)0)
#else
#define assert(e)  \
	((void) ((e) ? ((void)0) : __assert (#e, __FILE__, __LINE__)))
#define __assert(e, file, line) \
	((void)printf ("%s:%u: failed assertion `%s'\n", file, line, e), abort())
#endif
```

Swift’s assert analog provides almost all of the functionality of C’s assert, without using the preprocessor, and in a much cleaner way. Let’s dive in and learn about some interesting features of Swift.

### Lazy Evaluation of Arguments

When implementing assert() in Swift, the first challenge we encounter is that there is no obvious way for a function to accept an expression without evaluating it. For example, say we tried to use:

```swift
func assert(x : Bool) {
	#if !NDEBUG

		/*noop*/
	#endif
}
```

Even when assertions are disabled, the application would take the performance hit of evaluating the expression:

```swift
assert(someExpensiveComputation() != 42)
```

One way we could fix this is by changing the definition of assert to take a closure:

```swift
func assert(predicate : () -> Bool) {
	#if !NDEBUG
		if !predicate() {
			abort()
		}
	#endif
}
```

This evaluates the expression only when assertions are enabled, like we want, but it leaves us with an unfortunate calling syntax:

```swift
assert({ someExpensiveComputation() != 42 })
```

We can fix this by using the Swift @autoclosure attribute. The auto-closure attribute can be used on an argument to a function to indicate that an unadorned expression should be implicitly wrapped in a closure to the function. The example then looks like this:

```swift
func assert(predicate : @autoclosure () -> Bool) {
	#if !NDEBUG
		if !predicate() {
			abort()
		}
	#endif
}
```

This allows you to call it naturally, as in:

```swift
assert(someExpensiveComputation() != 42)
```

Auto-closures are a powerful feature because you can conditionally evaluate an expression, evaluate it many times, and use the bound expression in any way a closure can be used. Auto-closures are used in other places in Swift as well. For example, the implementation of short-circuiting logical operators looks like this:

```swift
func &&(lhs: BooleanType, rhs: @autoclosure () -> BooleanType) -> Bool {
	return lhs.boolValue ? rhs().boolValue : false
}
```

By taking the right side of the expression as an auto-closure, Swift provides proper lazy evaluation of that subexpression.

### Auto-Closures

As with macros in C, auto-closures are a very powerful feature that must be used carefully because there is no indication on the caller side that argument evaluation is affected. Auto-closures are intentionally limited to only take an empty argument list, and you shouldn’t use them in cases that feel like control flow. Use them when they provide useful semantics that people would expect (perhaps for a “futures” API) but don’t use them just to optimize out the braces on closures.

This covers one special aspect of the implementation of assert in Swift, but there is more to come.



Jul 23, 2014

# [Access Control](https://developer.apple.com/swift/blog/?id=5)

In Xcode 6 beta 4, Swift adds support for access control. This gives you complete control over what part of the code is accessible within a single file, available across your project, or made public as API for anyone that imports your framework. The three access levels included in this release are:

- private entities are available only from within the source file where they are defined.
- internal entities are available to the entire module that includes the definition (e.g. an app or framework target).
- public entities are intended for use as API, and can be accessed by any file that imports the module, e.g. as a framework used in several of your projects.

By default, all entities have internal access. This allows application developers to largely ignore access control, and most Swift code already written will continue to work without change. Your framework code does need to be updated to define public API, giving you total control of the exposed interface your framework provides.

The private access level is the most restrictive, and makes it easy to hide implementation details from other source files. By properly structuring your code, you can safely use features like extensions and top-level functions without exposing that code to the rest of your project.

Developers building frameworks to be used across their projects need to mark their API as public. While distribution and use of 3rd-party binary frameworks is not recommended (as mentioned in a previous blog post), Swift supports construction and distribution of frameworks in source form.

In addition to allowing access specification for an entire declaration, Swift allows the get of a property to be more accessible than its set. Here is an example class that is part of a framework:

```swift
public class ListItem {

	// Public properties.
	public var text: String
	public var isComplete: Bool

	// Readable throughout the module, but only writeable from within this file.
	private(set) var UUID: NSUUID

	public init(text: String, completed: Bool, UUID: NSUUID) {
		self.text = text
		self.isComplete = completed
		self.UUID = UUID
	}

	// Usable within the framework target, but not by other targets.
	func refreshIdentity() {
		self.UUID = NSUUID()
	}

	public override func isEqual(object: AnyObject?) -> Bool {
		if let item = object as? ListItem {
			return self.UUID == item.UUID
		}
		return false
	}
}

```

When mixing Objective-C and Swift, because the generated header for a framework is part of the framework’s public Objective-C interface, only declarations marked public appear in the generated header for a Swift framework. For applications, the generated header contains both public and internal declarations.

For more information, [The Swift Programming Language](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/) and [Using Swift with Cocoa and Objective-C](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/BuildingCocoaApps/) books have been updated to cover access control. [Read the complete Xcode 6 beta 4 release notes here](https://developer.apple.com/devcenter/download.action?path=/Developer_Tools/xcode_6_beta_4_o2p8fz/xcode_6_beta_4_release_notes.pdf).



Jul 28, 2014

# [Interacting with C Pointers](https://developer.apple.com/swift/blog/?id=6)

Objective-C and C APIs often require the use of pointers. Data types in Swift are designed to feel natural when working with pointer-based Cocoa APIs, and Swift automatically handles several of the most common use cases for pointers as arguments. In this post we’ll look at how pointer parameters in C can be used with the variables, arrays, and strings in Swift.

### Pointers as In/Out Parameters

C and Objective-C don’t support multiple return values, so Cocoa APIs frequently use pointers as a way of passing additional data in and out of functions. Swift allows pointer parameters to be treated like inoutparameters, so you can pass a reference to a var as a pointer argument by using the same & syntax. For instance, UIColor’s getRed(_:green:blue:alpha:) method takes four CGFloat* pointers to receive the components of the color. We can use & to collect these components into local variables:

```swift
var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
color.getRed(&r, green: &g, blue: &b, alpha: &a)

```

Another common case is the Cocoa NSError idiom. Many methods take an NSError** parameter to save an error in case of failure. For instance, we can list the contents of a directory using NSFileManager’s contentsOfDirectoryAtPath(_:error:) method, saving the potential error directly to an NSError? variable:

```swift
var maybeError: NSError?
if let contents = NSFileManager.defaultManager()
	.contentsOfDirectoryAtPath("/usr/bin", error: &maybeError) {
	// Work with the directory contents
} else if let error = maybeError {
	// Handle the error
}

```

For safety, Swift requires the variables to be initialized before being passed with &. This is because it cannot know whether the method being called tries to read from a pointer before writing to it.

### Pointers as Array Parameters

Pointers are deeply intertwined with arrays in C, and Swift facilitates working with array-based C APIs by allowing Array to be used as a pointer argument. An immutable array value can be passed directly as a const pointer, and a mutable array can be passed as a non-const pointer argument using the & operator, just like an inoutparameter. For instance, we can add two arrays a and b using the vDSP_vadd function from the Accelerate framework, writing the result to a third result array:

```swift
import Accelerate

let a: [Float] = [1, 2, 3, 4]
let b: [Float] = [0.5, 0.25, 0.125, 0.0625]
var result: [Float] = [0, 0, 0, 0]

vDSP_vadd(a, 1, b, 1, &result, 1, 4)

// result now contains [1.5, 2.25, 3.125, 4.0625]

```

### Pointers as String Parameters

C uses const char* pointers as the primary way to pass around strings. A Swift String can be used as a const char* pointer, which will pass the function a pointer to a null-terminated, UTF-8-encoded representation of the string. For instance, we can pass strings directly to standard C and POSIX library functions:

```swift
puts("Hello from libc")
let fd = open("/tmp/scratch.txt", O_WRONLY|O_CREAT, 0o666)

if fd < 0 {
	perror("could not open /tmp/scratch.txt")
} else {
	let text = "Hello World"
	write(fd, text, strlen(text))
	close(fd)
}

```

### Safety with Pointer Argument Conversions

Swift works hard to make interaction with C pointers convenient, because of their pervasiveness within Cocoa, while providing some level of safety. However, interaction with C pointers is inherently unsafe compared to your other Swift code, so care must be taken. In particular:

- These conversions cannot safely be used if the callee saves the pointer value for use after it returns. The pointer that results from these conversions is only guaranteed to be valid for the duration of a call. Even if you pass the same variable, array, or string as multiple pointer arguments, you could receive a different pointer each time. An exception to this is global or static stored variables. You can safely use the address of a global variable as a persistent unique pointer value, e.g.: as a KVO context parameter.
- Bounds checking is not enforced when a pointer to an Array or String is passed. A C-based API can’t grow the array or string, so you must ensure that the array or string is of the correct size before passing it over to the C-based API.

If you need to work with pointer-based APIs that don’t follow these guidelines, or you need to override Cocoa methods that accept pointer parameters, then you can work directly with raw memory in Swift using unsafe pointers. We’ll look at a more advanced case in a future post.





Aug 1, 2014

# [Files and Initialization](https://developer.apple.com/swift/blog/?id=7)

By now, most of you have written a small Swift app or experimented in the playground. You may even have experienced an error after you copied code from a playground into another file and wondered, “What is actually going on? What is the difference between a playground file, and other Swift source files?” This post will explain how Swift deals with the files in your project, and how global data is initialized.

### Files in an App

A Swift app is composed of any number of files, each with the functions, classes, and other declarations that make up the app. Most Swift files in your app are **order-independent**, meaning you can use a type before it is defined, and can even import modules at the bottom of the file (although that is not recommended Swift style.)

However, top-level code is not allowed in most of your Swift source files. For clarity, any executable statement not written within a function body, within a class, or otherwise encapsulated is considered top-level. We have this rule because if top-level code were allowed in all your files, it would be hard to determine where to start the program.

### Playgrounds, REPL, and Top-Level Code

You may be wondering why the code below works perfectly in a playground. This example isn’t encapsulated in anything, so it must be top-level code:

```
println("Hello world")

```

The above single-line program works — with no additional code at all — because playground files do support the execution of top-level code. Code within a playground file is **order-dependent**, run in top-down lexical order. For example, you can’t use a type before you define it. Of course, Swift playground files can also define functions, classes, and any other legal Swift code, but they don’t need to. This makes it easy to learn the Swift language or try a new API without writing a lot of code to get started.

In addition to playgrounds, top-level code can also be run in the REPL (Read-Eval-Print-Loop) or when launching Swift files as scripts. To use Swift for scripting, you can use shebang-style launching by starting your Swift file with “#!/usr/bin/xcrun swift” or type “xcrun swift myFile.swift” within Terminal.

### Application Entry Points and “main.swift”

You’ll notice that earlier we said top-level code isn’t allowed in *most* of your app’s source files. The exception is a special file named “main.swift”, which behaves much like a playground file, but is built with your app’s source code. The “main.swift” file can contain top-level code, and the order-dependent rules apply as well. In effect, the first line of code to run in “main.swift” is implicitly defined as the main entrypoint for the program. This allows the minimal Swift program to be a single line — as long as that line is in “main.swift”.

In Xcode, Mac templates default to including a “main.swift” file, but for iOS apps the default for new iOS project templates is to add @UIApplicationMain to a regular Swift file. This causes the compiler to synthesize a mainentry point for your iOS app, and eliminates the need for a “main.swift” file.

Alternatively, you can link in an implementation of main written in Objective-C, common when incrementally migrating projects from Objective-C to Swift.

### Global Variables

Given how Swift determines where to start executing an app, how should global variables work? In the following line of code, when should the initializer run?

```
var someGlobal = foo()

```

In a single-file program, code is executed top-down, similar to the behavior of variables within a function. Pretty simple. The answer for complex apps is less obvious, and we considered three different options:

- Restrict initializers of global variables to be simple constant expressions, as C does.
- Allow any initializer, run as a static constructor at app load time, as C++ does.
- Initialize lazily, run the initializer for a global the first time it is referenced, similar to Java.

The first approach was ruled out because Swift doesn’t need constant expressions like C does. In Swift, constants are generally implemented as (inlined) function calls. And there are good reasons to use complex initializers, e.g. to set up singletons or allocate a dictionary.

The second approach was ruled out because it is bad for the performance of large systems, as all of the initializers in all the files must run before the application starts up. This is also unpredictable, as the order of initialization in different files is unspecified.

Swift uses the third approach, which is the best of all worlds: it allows custom initializers, startup time in Swift scales cleanly with no global initializers to slow it down, and the order of execution is completely predictable.

The lazy initializer for a global variable (also for static members of structs and enums) is run the first time that global is accessed, and is launched as dispatch_once to make sure that the initialization is atomic. This enables a cool way to use dispatch_once in your code: just declare a global variable with an initializer and mark it private.

### Summary

Swift is designed to make it easy to experiment in a playground or to quickly build a script. A complete program can be a single line of code. Of course, Swift was also designed to scale to the most complex apps you can dream up. With “main.swift” you can take complete control over initialization or you can let @UIApplicationMain do the startup work for you on iOS.





Aug 5, 2014

# [Boolean](https://developer.apple.com/swift/blog/?id=8)

The boolean Bool type in Swift underlies a lot of primitive functionality, making it an interesting demonstration of how to build a simple type. This post walks through the creation of a new MyBool type designed and implemented to be very similar to the Bool type built into Swift. We hope this walk through the design of a simple Swift type will help you better understand how the language works.

Let’s start with the basic definition. The MyBool type models two different cases, perfect for an enum:

```
enum MyBool {
	case myTrue, myFalse
}

```

To reduce confusion in this post, we’ve named the cases myTrue and myFalse. We want MyBool() to produce a false value, and can do so by providing an init method:

```
extension MyBool {
	init() { self = .myFalse }
}

```

Swift enum declarations implicitly scope their enumerators within their body, allowing us to refer to MyBool.myFalse and even .myFalse when a contextual type is available. However, we want our type to work with the primitive true and false literal keywords. To make this work, we can make MyBool conform to the BooleanLiteralConvertible protocol like this:

```
extension MyBool : BooleanLiteralConvertible {
	static func convertFromBooleanLiteral(value: Bool) -> MyBool {
		return value ? myTrue : myFalse
	}
}

// We can now assign 'true' and 'false' to MyBool.
var a : MyBool = true

```

With this set up, we have our basic type, but we still can’t do much with it. Booleans need to be testable within an if condition. Swift models this with the BooleanType protocol, which allows any type to be used as a logical condition:

```
extension MyBool : BooleanType {
	var boolValue: Bool {
		switch self {
		case .myTrue: return true
		case .myFalse: return false
		}
	}
}

// Can now test MyBool in 'if' and 'while' statement conditions.
if a {}

```

We also want anything that conforms to BooleanType to be castable to MyBool, so we add:

```
extension MyBool {
	// MyBool can be constructed from BooleanType
	init(_ v : BooleanType) {
		if v.boolValue {
			self = .myTrue
		} else {
			self = .myFalse
		}
	}
}

// Can now convert from other boolean-like types.
var basicBool : Bool = true
a = MyBool(basicBool)

```

Note that the use of _ in the initializer argument list disables the keyword argument, which allows the MyBool(x) syntax to be used instead of requiring MyBool(v: x).

Now that we have basic functionality, let’s define some operators to work with it, starting with the == operator. Simple enums that have no associated data (like MyBool) are automatically made Equatable by the compiler, so no additional code is required. However, you can make arbitrary types equatable by conforming to the Equatableprotocol and implementing the == operator. If MyBool weren’t already Equatable, this would look like this:

```
extension MyBool : Equatable {
}

func ==(lhs: MyBool, rhs: MyBool) -> Bool {
	switch (lhs, rhs) {
	case (.myTrue,.myTrue), (.myFalse,.myFalse):
		return true
	default:
		return false
	}
}

// Can now compare with == and !=
if a == a {}
if a != a {}

```

Here we’re using some simple pattern matching in the switch statement to handle this. Since MyBool is now Equatable, we get a free implementation of the != operator. Lets add binary operations:

```
func &(lhs: MyBool, rhs: MyBool) -> MyBool {
	if lhs {
		return rhs
	}
	return false
}

func |(lhs: MyBool, rhs: MyBool) -> MyBool {
	if lhs {
		return true
	}
	return rhs
}

func ^(lhs: MyBool, rhs: MyBool) -> MyBool {
	return MyBool(lhs != rhs)
}

```

With the basic operators in place, we can implement a variety of helpful unary and compound assignment operators as well, for example:

```
prefix func !(a: MyBool) -> MyBool {
	return a ^ true
}

// Compound assignment (with bitwise and)
func &=(inout lhs: MyBool, rhs: MyBool) {
	lhs = lhs & rhs
}

```

The &= operator takes the left operand as inout because it reads and writes to it, and the effect must be visible to the user of the operator. Swift gives you complete control over mutability of operations on value types like enum and struct.

With this, the simple MyBool type has all of the basic operations and operators. Hopefully this post gives you a few tips that you can apply to your own code when defining higher-level types.



Aug 8, 2014

# [Balloons](https://developer.apple.com/swift/blog/?id=9)

Many people have asked about the Balloons playground we demonstrated when introducing Swift at WWDC. Balloons shows that writing code can be interactive and fun, while presenting several great features of playgrounds. Now you can learn how the special effects were done with this tutorial version of ‘Balloons.playground’, which includes documentation and suggestions for experimentation.

This playground uses new features of SpriteKit and requires the latest beta versions of Xcode 6 and OS X Yosemite.[Demo](https://developer.apple.com/swift/blog/downloads/Balloons.zip)





Aug 15, 2014

# [Value and Reference Types](https://developer.apple.com/swift/blog/?id=10)

Types in Swift fall into one of two categories: first, “value types”, where each instance keeps a unique copy of its data, usually defined as a struct, enum, or tuple. The second, “reference types”, where instances share a single copy of the data, and the type is usually defined as a class. In this post we explore the merits of value and reference types, and how to choose between them. 

### What’s the Difference? 

The most basic distinguishing feature of a *value type* is that copying — the effect of assignment, initialization, and argument passing — creates an *independent instance* with its own unique copy of its data:

```
// Value type example
struct S { var data: Int = -1 }
var a = S()
var b = a						// a is copied to b
a.data = 42						// Changes a, not b
println("\(a.data), \(b.data)")	// prints "42, -1"

```

Copying a reference, on the other hand, implicitly creates a shared instance. After a copy, two variables then refer to a single instance of the data, so modifying data in the second variable also affects the original, e.g.:

```
// Reference type example
class C { var data: Int = -1 }
var x = C()
var y = x						// x is copied to y
x.data = 42						// changes the instance referred to by x (and y)
println("\(x.data), \(y.data)")	// prints "42, 42"

```

### The Role of Mutation in Safety

One of the primary reasons to choose value types over reference types is the ability to more easily reason about your code. If you always get a unique, copied instance, you can trust that no other part of your app is changing the data under the covers. This is especially helpful in multi-threaded environments where a different thread could alter your data out from under you. This can create nasty bugs that are extremely hard to debug.

Because the difference is defined in terms of what happens when you change data, there’s one case where value and reference types overlap: when instances have no writable data. In the absence of mutation, values and references act exactly the same way.

You may be thinking that it could be valuable, then, to have a case where a class is completely immutable. This would make it easier to use Cocoa NSObject objects, while maintaining the benefits of value semantics. Today, you can write an immutable class in Swift by using only immutable stored properties and avoiding exposing any APIs that can modify state. In fact, many common Cocoa classes, such as NSURL, are designed as immutable classes. However, Swift does not currently provide any language mechanism to enforce class immutability (e.g. on subclasses) the way it enforces immutability for struct and enum.

### How to Choose?

So if you want to build a new type, how do you decide which kind to make? When you’re working with Cocoa, many APIs expect subclasses of NSObject, so you have to use a class. For the other cases, here are some guidelines:

Use a value type when:

- Comparing instance data with == makes sense
- You want copies to have independent state
- The data will be used in code across multiple threads

Use a reference type (e.g. use a class) when:

- Comparing instance identity with === makes sense
- You want to create shared, mutable state

In Swift, Array, String, and Dictionary are all value types. They behave much like a simple int value in C, acting as a unique instance of that data. You don’t need to do anything special — such as making an explicit copy — to prevent other code from modifying that data behind your back. Importantly, you can safely pass copies of values across threads without synchronization. In the spirit of improving safety, this model will help you write more predictable code in Swift.





Aug 19, 2014

# [Access Control and protected](https://developer.apple.com/swift/blog/?id=11)

The response to support for access control in Swift has been extremely positive. However, some developers have been asking, “Why doesn’t Swift have something like protected?” Many other programming languages have an access control option that restricts certain methods from being accessed from anywhere except subclasses.

When designing access control levels in Swift, we considered two main use cases:

- keep private details of a class hidden from the rest of the app
- keep internal details of a framework hidden from the client app

These correspond to private and internal levels of access, respectively.

In contrast, protected conflates access with inheritance, adding an entirely new control axis to reason about. It doesn’t actually offer any real protection, since a subclass can always expose “protected” API through a new public method or property. It doesn’t offer additional optimization opportunities either, since new overrides can come from anywhere. And it’s unnecessarily restrictive — it allows subclasses, but not any of the subclass’s helpers, to access something.

As some developers have pointed out, Apple frameworks do occasionally separate parts of API intended for use by subclasses. Wouldn’t protected be helpful here? Upon inspection, these methods generally fall into one of two groups. First, methods that aren’t really useful outside the subclass, so protection isn’t critical (and recall the helper case above). Second, methods that are designed to be overridden but not called. An example is drawRect(_:), which is certainly used within the UIKit codebase but is not to be called outside UIKit.

It’s also not clear how protected should interact with extensions. Does an extension to a class have access to that class’s protected members? Does an extension to a subclass have access to the superclass’s protected members? Does it make a difference if the extension is declared in the same module as the class?

There was one other influence that led us to the current design: existing practices of Objective-C developers both inside and outside of Apple. Objective-C methods and properties are generally declared in a public header (.h) file, but can also be added in class extensions within the implementation (.m) file. When parts of a public class are intended for use elsewhere within the framework but not outside, developers create a second header file with the class’s “internal” bits. These three levels of access correspond to public, private, and internal in Swift.

Swift provides access control along a single, easy-to-understand axis, unrelated to inheritance. We believe this model is simpler, and provides access control the way it is most often needed: to isolate implementation details to within a class or within a framework. It may be different from what you’ve used before, but we encourage you to try it out.





Aug 26, 2014

# [Optionals Case Study: valuesForKeys](https://developer.apple.com/swift/blog/?id=12)

This post explores how optionals help preserve strong type safety within Swift. We’re going to create a Swift version of an Objective-C API. Swift doesn’t really need this API, but it makes for a fun example.

In Objective-C, NSDictionary has a method -objectsForKeys:notFoundMarker: that takes an NSArray of keys, and returns an NSArray of corresponding values. From the documentation: “the *N*-th object in the returned array corresponds to the *N*-th key in [the input parameter] keys.” What if the third key isn’t actually in the dictionary? That’s where the notFoundMarker parameter comes in. The third element in the array will be this marker object rather than a value from the dictionary. The Foundation framework even provides a class for this case if you don’t have another to use: NSNull.

In Swift, the Dictionary type doesn’t have an objectsForKeys equivalent. For this exercise, we’re going to add one — as valuesForKeys in keeping with the common use of ‘value’ in Swift — using an extension:

```
extension Dictionary {
	func valuesForKeys(keys: [K], notFoundMarker: V) -> [V] {
		// To be implemented
	}
}

```

This is where our new implementation in Swift will differ from Objective-C. In Swift, the stronger typing restricts the resulting array to contain only a single type of element — we can’t put NSNull in an array of strings. However, Swift gives an even better option: we can return an array of optionals. All our values get wrapped in optionals, and instead of NSNull, we just use nil.

```
extension Dictionary {
	func valuesForKeys(keys: [Key]) -> [Value?] {
		var result = [Value?]()
		result.reserveCapacity(keys.count)
		for key in keys {
			result.append(self[key])
		}
		return result
	}
}

```

NOTE: Some of you may have guessed why a Swift Dictionary doesn’t need this API, and already imagined something like this:

```
extension Dictionary {
	func valuesForKeys(keys: [Key]) -> [Value?] {
		return keys.map { self[$0] }
	}
}

```

This has the exact same effect as the imperative version above, but all of the boilerplate has been wrapped up in the call to map. This is great example why Swift types often have a small API surface area, because it’s so easy to just call map directly.

Now we can try out some examples:

```
let dict = ["A": "Amir", "B": "Bertha", "C": "Ching"]

dict.valuesForKeys(["A", "C"])
// [Optional("Amir"), Optional("Ching")]

dict.valuesForKeys(["B", "D"])
// [Optional("Bertha"), nil]

dict.valuesForKeys([])
// []

```

### Nested Optionals

Now, what if we asked for the last element of each result?

```
dict.valuesForKeys(["A", "C"]).last
// Optional(Optional("Ching"))

dict.valuesForKeys(["B", "D"]).last
// Optional(nil)

dict.valuesForKeys([]).last
// nil

```

That’s strange — we have two levels of Optional in the first case, and Optional(nil) in the second case. What’s going on?

Remember the declaration of the last property:

```
var last: T? { get }

```

This says that the last property’s type is an Optional version of the array’s element type. In *this* case, the element type is also optional (String?). So we end up with String??, a doubly-nested optional type.

So what does Optional(nil) mean?

Recall that in Objective-C we were going to use NSNull as a placeholder. The Objective-C version of these three calls looks like this:

```
[dict valuesForKeys:@[@"A", @"C"] notFoundMarker:[NSNull null]].lastObject
// @"Ching"

[dict valuesForKeys:@[@"B", @"D"] notFoundMarker:[NSNull null]].lastObject
// NSNull

[dict valuesForKeys:@[] notFoundMarker:[NSNull null]].lastObject
// nil

```

In both the Swift and Objective-C cases, a return value of nil means “the array is empty, therefore there’s no last element.” The return value of Optional(nil) (or in Objective-C NSNull) means “the last element of this array exists, but it represents an absence.” Objective-C has to rely on a placeholder object to do this, but Swift can represent it in the type system.

### Providing a Default

To wrap up, what if you *did* want to provide a default value for anything that wasn’t in the dictionary? Well, that’s easy enough.

```
extension Dictionary {
	func valuesForKeys(keys: [Key], notFoundMarker: Value) -> [Value] {
		return self.valuesForKeys(keys).map { $0 ?? notFoundMarker }
	}
}


dict.valuesForKeys(["B", "D"], notFoundMarker: "Anonymous")
// ["Bertha", "Anonymous"]

```

While Objective-C has to rely on a placeholder object to do this, Swift can represent it in the type system, and provides rich syntactic support for handling optional results.





Sep 3, 2014

# [Patterns Playground](https://developer.apple.com/swift/blog/?id=13)

In Swift, a pattern is a way to describe and match a set of values based on certain rules, such as: 

- All tuples whose first value is 0
- All numbers in the range 1...5
- All class instances of a certain type

The learning playground linked below includes embedded documentation and experiments for you to perform. Download it for an interactive experience that will give you a jump start into using patterns in your own apps.

This playground requires the latest beta version of Xcode 6 on OS X Mavericks or OS X Yosemite beta.

[Demo](https://developer.apple.com/swift/blog/downloads/Patterns.zip) 





Sep 9, 2014

# [Swift Has Reached 1.0](https://developer.apple.com/swift/blog/?id=14)

On June 2, 2014 at WWDC, the Swift team finally showed you what we had been working on for years. That was a big day with lots of excitement, for us and for developers around the world. Today, we’ve reached the second giant milestone:

Swift version 1.0 is now GM.

You can now submit your apps that use Swift to the App Store. Whether your app uses Swift for a small feature or a complete application, now is the time to share your app with the world. It’s your turn to excite everyone with your new creations.

### Swift for OS X

Today is the GM date for Swift on iOS. We have one more GM date to go for Mac. Swift for OS X currently requires the SDK for OS X Yosemite, and when Yosemite ships later this fall, Swift will also be GM on the Mac. In the meantime, you can keep developing your Mac apps with Swift by downloading the beta of [Xcode 6.1](https://developer.apple.com/xcode/downloads/).

### The Road Ahead

You’ll notice we’re using the word “GM”, not “final”. That’s because Swift will continue to advance with new features, improved performance, and refined syntax. In fact, you can expect a few improvements to come in Xcode 6.1 in time for the Yosemite launch. Because your apps today embed a version of the Swift GM runtime, they will continue to run well into the future.





Sep 25, 2014

# [Building assert() in Swift, Part 2: __FILE__ and __LINE__](https://developer.apple.com/swift/blog/?id=15)

Two occasionally useful features of C are the __FILE__ and __LINE__ magic macros. These are built into the preprocessor, and expanded out before the C parser is run. Despite not having a preprocessor, Swift provides very similar functionality with similar names, but Swift works quite differently under the covers.

### Built-In Identifiers

As described in [the Swift programming guide](https://developer.apple.com/library/prerelease/ios/documentation/swift/conceptual/swift_programming_language/LexicalStructure.html), Swift has a number of built-in identifiers, including __FILE__,__LINE__, __COLUMN__, and __FUNCTION__. These expressions can be used anywhere and are expanded by the parser to string or integer literals that correspond to the current location in the source code. This is incredibly useful for manual logging, e.g. to print out the current position before quitting.

However, this doesn’t help us in our quest to implement assert(). If we defined assert like this:

```
func assert(predicate : @autoclosure () -> Bool) { 
	#if DEBUG
		if !predicate() {
			println("assertion failed at \(__FILE__):\(__LINE__)")
			abort()
		}
	#endif
}
```

The above code would print out of the file/line location that implements assert() itself, not the location from the caller. That isn’t helpful.

### Getting the location of a caller

Swift borrows a clever feature from the D language: these identifiers expand to the location of the caller *when evaluated in a default argument list*. To enable this behavior, the assert() function is defined something like this:

```
func assert(condition: @autoclosure () -> Bool, _ message: String = "",
	file: String = __FILE__, line: Int = __LINE__) {
		#if DEBUG
			if !condition() {
				println("assertion failed at \(file):\(line): \(message)")
				abort()
			}
		#endif
}
```

The second parameter to the Swift assert() function is an optional string that you can specify, and the third and forth arguments are defaulted to be the position in the caller’s context. This allows assert() to pick up the source location of the caller by default, and if you want to define your own abstractions on top of assert, you can pass down locations from its caller. As a trivial example, you could define a function that logs and asserts like this:

```
func logAndAssert(condition: @autoclosure () -> Bool, _ message: StaticString = "",
	file: StaticString = __FILE__, line: UWord = __LINE__) {

	logMessage(message)
	assert(condition, message, file: file, line: line)
}
```

This properly propagates the file/line location of the logAndAssert() caller down to the implementation ofassert(). Note that StaticString, as shown in the code above, is a simple String-like type used to store a string literal, such as one produced by __FILE__, with no memory-management overhead.

In addition to being useful for assert(), this functionality is used in the Swift implementation of the higher-level XCTest framework, and may be useful for your own libraries as well.





Oct 7, 2014

# [Building Your First Swift App Video](https://developer.apple.com/swift/blog/?id=16)

UPDATE: To make it easier to follow along, we’ve included the [code](https://developer.apple.com/swift/blog/downloads/ViewController.txt) you see pasted in the video.

So far the Swift blog has focused on advanced programming topics, including the design principles of the Swift language. We thought it would be helpful to provide content for programmers who are new to Swift and just trying Xcode for the first time. To make it more approachable for everyone, we put together a very short video that demonstrates how to build an iOS app in Swift from scratch, in less than ten minutes.

 

视频500M在iMac上下载的。国庆节我还在做ToDo app



### Swift 1.1发布了新特性，同时兼容了OS X开发了

Oct 20, 2014

# [Failable Initializers](https://developer.apple.com/swift/blog/?id=17)

Swift version 1.1 is new in [Xcode 6.1](https://developer.apple.com/xcode/downloads/), and it introduces a new feature: failable initializers. Initialization is the process of providing initial values to each of the stored properties of a class or struct, establishing the invariants of the object. In some cases initialization can fail. For example, initializing the object requires access to a resource, such as loading an image from a file:

```
NSImage(contentsOfFile: "swift.png")
```

If the file does not exist or is unreadable for any reason, the initialization of the NSImage will fail. With Swift version 1.1, such failures can be reported using a failable initializer. When constructing an object using a failable initializer, the result is an optional that either contains the object (when the initialization succeeded) or containsnil (when the initialization failed). Therefore, the initialization above should handle the optional result directly:

```
if let image = NSImage(contentsOfFile: "swift.png") {
	// loaded the image successfully
} else {
	// could not load the image
}
```

An initializer defined with init can be made failable by adding a ? or a ! after the init, which indicates the form of optional that will be produced by constructing an object with that initializer. For example, one could add a failable initializer to Int that attempts to perform a conversion from a String:

```
extension Int {
	init?(fromString: String) { 
		if let i = fromString.toInt() {
			// Initialize
			self = i
		} else { 
			// return nil, discarding self is implied
			return nil
		}
	}
}
```

In a failable initializer, return nil indicates that initialization has failed; no other value can be returned. In the example, failure occurs when the string could not be parsed as an integer. Otherwise, self is initialized to the parsed value.

Failable initializers eliminate the most common reason for factory methods in Swift, which were previously the only way to report failure when constructing this object. For example, enums that have a raw type provided a factory method fromRaw that returned an optional enum. Now, the Swift compiler synthesizes a failable initializer that takes a raw value and attempts to map it to one of the enum cases. For example:

```
enum Color : Int {
	case Red = 0, Green = 1, Blue = 2

	// implicitly synthesized
	var rawValue: Int { /* returns raw value for current case */ }

	// implicitly synthesized
	init?(rawValue: Int) {
		switch rawValue { 
			case 0: self = .Red
			case 1: self = .Green
			case 2: self = .Blue
			default: return nil
		}
	}
}
```

Using the failable initializer allows greater use of Swift’s uniform construction syntax, which simplifies the language by eliminating the confusion and duplication between initializers and factory methods. Along with the introduction of failable initializers, Swift now treats more Cocoa factory methods — those with NSErrorarguments — as initializers, providing a more uniform experience for object construction.



Nov 11, 2014

# [Introduction to the Swift REPL](https://developer.apple.com/swift/blog/?id=18)

Xcode 6.1 introduces yet another way to experiment with Swift in the form of an interactive Read Eval Print Loop, or REPL. Developers familiar with interpreted languages will feel comfortable in this command-line environment, and even experienced developers will find a few unique features. To get started, launch Terminal.app (found in /Applications/Utilities) and type “swift” at the prompt in OS X Yosemite, or “xcrun swift” in OS X Mavericks. You’ll then be in the Swift REPL:

```
Welcome to Swift version 1.1 (swift-600.0.20.0). Type :help for assistance.
  1>   
```



All you need to do is type Swift statements and the REPL will immediately execute your code. Expression results are automatically formatted and displayed along with their type, as are the results of both variable and constant declarations. Console output flows naturally within the interactive session:

```
  1> "100".toInt()
$R0: Int? = 100
  2> let name = "Katherine"
name: String = "Katherine"
  3> println("Hello, \(name)")
Hello, Katherine
```

Note that the result from line one has been given a name by the REPL even though the result of the expression wasn’t explicitly assigned to anything. You can reference these results to reuse their values in subsequent statements:

```
  4> $R0! + 200
$R1: Int = 300
```

The Swift compiler recognizes incomplete code, and will prompt for additional input when needed. Your code will even be indented automatically as it would in Xcode. For instance, starting a function:

```
5> func timesTwo() {
6.		 
```

The prompt for continuation lines is a line number followed by a period instead of the angle bracket that indicates a new statement, so you can tell at a glance when you’re being asked to complete a code fragment. At this point you can keep typing remaining lines in the method:

```
5> func timesTwo() {
6.		return value * 2
7. }  
```

There are three noteworthy points to make here: The first is that line six was originally indented, but the REPL automatically unindented when we typed the closing brace. The second is that the function references a parameter we forgot to declare and needs a return type, so you’ll need to add both to the declaration. The last is that even if you did press return after the last line, it’s not too late to fix it.

### Multi-Line History

When code is submitted to the compiler it’s also recorded in the REPL history, which makes correcting mistakes trivial. If you pressed return at the end of the incomplete function declaration above, you’d be presented with the following message:

```
error: use of unresolved identifier 'value'
```

Like most history implementations, you can call up your last entry by pressing up arrow from the prompt. The REPL brings back all three lines in our example, and places the cursor at the end. You can now proceed with editing the code to correct your mistake as described in the next section.

Your history is preserved between sessions and will record hundreds of code fragments. Each time you move up from the top line you’ll move to an earlier history entry. Each time you move down from an empty line at the bottom of an entry you’ll move to a more recent history entry. The empty line that opens up before moving to the next entry comes in handy for reasons discussed below.

### Multi-Line Editing

Even though the REPL behaves like a traditional line editor, it also provides convenient features for dealing with multi-line input like most class or function declarations. In the example above, before pressing return on the final line you can press up arrow to move the cursor up to the declaration line, then use the left arrow to move the cursor just after the opening parenthesis for the parameter list:

```
5> func timesTwo() {
6.		return value * 2
7. }
```

Type the parameter declaration, press the right arrow to move past the closing parenthesis and add the return type as well:

```
5> func timesTwo(value: Int) -> Int {
6.		return value * 2
7. }
```

You can’t press return to complete the declaration at this point because you’re in the middle of a block of text. Pressing return here would insert a line break, which can be useful if you’re trying to insert additional lines in a function or method body, but what you want here is to move to the end of the declaration. You can press down arrow twice to get there, or use the Emacs sequence ESC > (the escape key followed by a closing angle bracket). Pressing return at the end of the last line will compile the newly declared function so it’s ready for use:

```
  8>  timesTwo(21)
$R2: (Int) = 42
```

Automatic detection of statement completion means that you can just type code and the REPL will do the right thing the vast majority of the time. There are occasions, however, where it’s necessary to submit more than one declaration at the same time because they have mutual dependencies. Consider the following code:

```
func foo() {
	bar()
}
func bar() {
	foo()
}
```

Typing everything above line by line will result in trying to compile the first function once the third line is complete, and of course this produces an error:

```
error: use of unresolved identifier 'bar'
```

You could declare both functions on a single line to get around automatic completion detection that takes place when you press return, but there’s a better solution. After typing the third line above you can press the down arrow to move to create a fourth line manually, and type the remainder normally. The two declarations are compiled together, achieving the desired goal of mutual recursion.

### Quick Reference

To help you get started, here’s a handy chart with some of the most commonly used editing and navigation keys:

```swift
Arrow Keys		Move cursor left/right/up/down
Control+F		Move cursor right one character, same as right arrow
Control+B		Move cursor left one character, same as left arrow
Control+N		Move cursor to end of next line, same as down arrow
Control+P		Move cursor to end of prior line, same as up arrow
Control+D		Delete the character under the cursor
Option+Left		Move cursor to start of prior word
Option+Right	Move cursor to start of next word
Control+A		Move cursor to start of current line
Control+E		Move cursor to end of current line
Delete			Delete the character to the left of the cursor
Esc <			Move cursor to start of first line
Esc >			Move cursor to end of last line
```





### Swift 1.1中方法签名的使用

Dec 12, 2014

# [What Happened to NSMethodSignature?](https://developer.apple.com/swift/blog/?id=19)

UPDATE: We’ve added the Request.playground file to this post so you can download it and easily experiment with the code yourself.

Bringing the Cocoa frameworks to Swift gave us a unique opportunity to look at our APIs with a fresh perspective. We found classes that we didn't feel fit with the goals of Swift, most often due to the priority we give to safety. For instance, some classes related to dynamic method invocation are not exposed in Swift, namely NSInvocationand NSMethodSignature.

We recently received a bug report from a developer who noticed this absence. This developer was usingNSMethodSignature in Objective-C to introspect the types of method arguments, and in the process of migrating this code to Swift, noticed that NSMethodSignature is not available. The code being migrated could accept HTTP handlers of varying signatures, such as:

```
func handleRequest(request: HTTPRequest, queryStringArguments: [String: String]) { }
func handleRequest(request: HTTPRequest, jsonBody: JSON) { }
```

In Objective-C, NSMethodSignature can be used to determine that the API of the first method would require a[String: String] argument, and the second method would require a JSON value. However, Swift is a powerful language and can easily handle this scenario without using NSMethodSignature, and in a way that doesn't undermine the help that the compiler provides for type and memory safety.

Here is an alternative way to solve the same problem in Swift:

```
struct HTTPRequest {
	// ...
}

protocol HTTPHandlerType {
	typealias Data

	/// :returns: true if the request was handled; false otherwise
	func handle(request: HTTPRequest, data: Data) -> Bool
}
```

First, we'll use a protocol to define that whatever is going to handle our HTTPRequest does so via this interface. This protocol is very simple, with only a single method.

Why use a protocol here, instead of subclassing an HTTPHandler class? Because protocols give the flexibility of leaving the implementation details up to the clients of this code. If we were to make an HTTPHandler class, we would require clients to also use classes, forcing upon them the semantics of reference types. However, by using a protocol, clients can decide for themselves the appropriate type to use in their code, whether it be class, struct, or even enum.

```
class HTTPServer {
	func addHandler<T: HTTPHandlerType>(handler: T) {
		handlers.append { (request: HTTPRequest, args: Any) -> Bool in
			if let typedArgs = args as? T.Data {
				return handler.handle(request, data: typedArgs)
			}
			return false
		}
	}

	// ...
}
```

Next, our HTTPServer class has a generic method that accepts an HTTPHandlerType as a parameter. By using the handler's associated type, it can perform the conditional downcast of the args parameter to determine if this handler should be given an opportunity to handle the request. Here we can see the benefit of definingHTTPHandlerType as a protocol. The HTTPServer doesn't need to know *how* the handler is reacting to the request, nor does it even need to care about the nature of the handler itself. All it needs to know is that the value can handle requests.

```
class HTTPServer {
	// ...

	private var handlers: [(HTTPRequest, Any) -> Bool] = []

	func dispatch(req: HTTPRequest, args: Any) -> Bool {
		for handler in handlers {
			if handler(req, args) {
				return true
			}
		}
		return false
	}
}
```

When our HTTPServer receives a request, it will iterate through its handlers and see if any can deal with the request.

Now we can easily create a custom HTTPHandlerType with varying argument types and register it with theHTTPServer:

```
class MyHandler : HTTPHandlerType {
	func handle(request: HTTPRequest, data: Int) -> Bool {
		return data > 5
	}
}

let server = HTTPServer()
server.addHandler(MyHandler())
server.dispatch(HTTPRequest(...), args: "x") // returns false
server.dispatch(HTTPRequest(...), args: 5)   // returns false
server.dispatch(HTTPRequest(...), args: 10)  // returns true
```

With a combination of protocols and generics, we have written Swift code to elegantly create and register HTTP handlers of varying types. This approach also lets the compiler guarantee type safety, while ensuring excellent runtime performance.





## Xcode 6.1引入了另外一种以交互式的方式来体验Swift的方法

Jan 23, 2015

# [Redefining Everything with the Swift REPL](https://developer.apple.com/swift/blog/?id=20)

Our [first entry on the REPL](https://developer.apple.com/swift/blog/?id=18) covered just the basics, showing how to use the REPL to experiment with Swift as you learn the language. This post explores one way that the REPL bends normal coding rules to give you new powers when developing.

### Redefining Identifiers

The Swift compiler automatically protects against a wide range of programming mistakes, including unintentional ambiguity arising from defining the same identifier twice:

```
swiftc -
var x = "The Answer"
var x = 42
^D
error: invalid redeclaration of 'x'
```

This makes sense when coding in a non-interactive editor, but in the REPL interactive environment it’s useful to be able to easily make changes. The REPL was specifically designed with this kind of convenience in mind:

```
  1> var x = "The Answer"
x: String = "The Answer"
  2> var x = 42
x: Int = 42
  3> x + 10
$R0: Int = 52
```

The newer definition replaces the existing definition for all subsequent references. As illustrated above, even the type of the definition can be changed in the process. This allows a wide range of experiments through iterative refinement. For example, you can start out with a recursive implementation of a function:

```
  4> func fib(index: Int) -> Int {
  5. 	if index <= 1 {
  6. 		return 1
  7. 	}
  8. 	return fib(index - 1) + fib(index - 2)
  9. }
 10> fib(40)
$R1: Int = 165580141
```

This is just one way to write this function. You can experiment with your code, trying out different algorithms and APIs. The REPL makes it easy to define a new and improved implementation:

```
 11> func fib(index: Int) -> Int {
 12. 	var lastValue = 1
 13. 	var currentValue = 1
 14. 	for var iteration = 2; iteration <= index; ++iteration {
 15. 		let newValue = lastValue + currentValue
 16. 		lastValue = currentValue
 17. 		currentValue = newValue
 18. 	}
 19.  	return currentValue
 20. }
 21> fib(40)
$R2: Int = 165580141
```

Typing the same expression in the REPL now executes the new implementation. This is a simple example, but it illustrates the iterative experimentation that the REPL was designed to facilitate.

### Redefinition or Overload?

Redefining constants, variables, and types all work intuitively, and, as we can see above, it is also possible to redefine functions. This raises an obvious question: how does this interact with function overloading? The REPL only replaces an existing definition when it has the same name and signature as shown in the Fibonacci example above. If a function with the same name but a distinct signature already exists, it just defines a new overload. Keep in mind that Swift allows function overloading even when two signatures differ only in their return type. For example:

```
 22> func foo() {
 23. 	println("Foo!")
 24. }
 25> func foo() -> String {
 26. 	return "Foo!"
 27. }
 28> foo()
error: ambiguous use of 'foo'
```

The above declarations define two distinct functions that must be called in a manner where only one of the available overloads can be inferred as returning a compatible type:

```
 28> var foo: String = foo()
foo: String = "Foo!"
 29> foo() as Void
Foo!
```

### Capturing Definitions

The ability to redefine an identifier is powerful, but it only applies to subsequent uses of the identifier. Any line of code that has already been compiled by the REPL retains its reference to the previous definition. It’s as if the new definition obscures the old one but doesn’t eliminate it entirely. The following illustrates how this works in practice:

```
 30> var message = "Hello, World!"
message: String = "Hello, World!"
 31> func printMessage() {
 32. 	println(message)
 33. }
 34> printMessage()
Hello, World!
 35> message = "Goodbye"
 36> printMessage()
Goodbye
 37> var message = "New Message"
 38> printMessage()
Goodbye
 39> println(message)
New Message
```

To understand what’s happening here it helps to walk though the example one statement at a time. Line 30 declares a variable named message with a greeting. Lines 31-33 declare a function named printMessage() that prints the contents of the variable declared on line 30. Line 34 calls the method and produces the expected result. So far it’s extremely straightforward.

The subtle distinctions start on line 35 which assigns a new value to the variable declared in line 30, and line 36 which prints this new value as expected. On the other hand, line 37 declares a new variable with the same name. This effectively hides the original variable from all subsequent code, but the call on line 38 invokes a function that was compiled before the redefinition. The function retains its original meaning and prints the value of the original variable, not the newly declared variable. Line 39 shows that the newly defined variable can be referenced, as expected, by new code.

All redefinitions work in this manner, whether they’re redefining a function, a variable, or a type. The REPL grants the freedom to redefine an identifier without restrictions, whereas prior references were compiled with strong semantic checks in place. What would happen if the message identifier in the example above were redefined as a type instead of a variable? The printMessage() function would no longer compile. Rather than ask developers to sort through endless potential edge cases like this, the REPL adheres to a world view that is always self-consistent.







Jan 28, 2015 [元旦的时候学习使用Swift 1.1, 使用Xcode 6.1.1。买了一个黑色iPhone5 64G-iOS 8.1.1]

# [New Swift Development Courses Available on iTunes U](https://developer.apple.com/swift/blog/?id=21)

iTunes U is the world’s largest online catalog of free educational content from top schools and prominent organizations. Thousands of educational institutions are hosting public and private courses encompassing the arts, sciences, health and medicine, education, business, software development and more. These courses offer the same curriculum as the on-campus class, and often include lecture videos.

Stanford University has one of the most popular iOS development courses on iTunes U, which has been downloaded over 1.2 million times. Now this course has been updated to use Swift. The first two lectures from the new [“Developing iOS 8 Apps with Swift”](http://itunes.com/StanfordSwift) class are now live and additional lessons will be added as they are taught. Swift courses from other internationally recognized universities, such as [Plymouth University](http://itunes.com/PlymouthSwift) in the UK, are also available on iTunes U with courses from other top educational institutions coming soon.





## Swift 1.2测试

Feb 9, 2015

# [Swift 1.2 and Xcode 6.3 beta](https://developer.apple.com/swift/blog/?id=22)

Today Swift 1.2 was released as part of Xcode 6.3 beta. This beta release includes a significantly enhanced Swift compiler, as well as new features in the Swift language itself. For the complete list of changes, read the [release notes](https://developer.apple.com/devcenter/download.action?path=/Developer_Tools/Xcode_6.3_beta/Xcode_6.3_beta_Release_Notes.pdf). This blog post will focus on the highlights.

### Compiler improvements

The Swift 1.2 compiler was engineered to be more stable and to improve performance in every way. These changes also provide a better experience when working with Swift in Xcode. Some of the most visible improvements include:

- **Incremental builds** — Source files that haven’t changed will no longer be re-compiled by default, which will significantly improve build times for most common cases. Larger structural changes to your code may still require multiple files to be rebuilt.
- **Faster executables** — Debug builds produce binaries that run considerably faster, and new optimizations deliver even better Release build performance.
- **Better compiler diagnostics** — Clearer error and warning messages, along with new Fix-its, make it easier to write proper Swift 1.2 code.
- **Stability improvements** — The most common compiler crashes have been fixed. You should also see fewer SourceKit warnings within the Xcode editor.

### New language features

In Swift 1.2, the language has been further refined to ensure safe, predictable behavior. We also continue to improve the interaction between Swift and Objective-C. Some of the more notable changes include:

- **as! for failable casts** — Casts that can fail at runtime are now expressed with the new as! operator to make their potential for runtime failure clear to readers and maintainers of your code.
- **Nullability may now be expressed in Objective-C headers** — New Objective-C extensions in Clang allow you to express the nullability of pointers and blocks in your Objective-C API. You can provide Objective-C frameworks that work great with Swift code, and improve your Swift experience when mixing and matching with Objective-C code in your own project.
- **Swift enums can now be exported to Objective-C using the @objc attribute** — For example, the following Swift code:

```
@objc enum Bear: Int {
	case Black, Grizzly, Polar
}
```

imports into Objective-C as:

```
typedef NS_ENUM(NSInteger, Bear) {
	BearBlack, BearGrizzly, BearPolar
};
```

- **let constants are now more powerful and consistent** — The new rule is that a let constant must be initialized before use (like a var), and that it may only be initialized, not reassigned or mutated after initialization.

This enables patterns like:

```
let x : SomeThing
if condition {
	x = foo()
} else {
	x = bar()
}
use(x)
```

This formerly required the use of a var even though there is no mutation taking place. Properties have been folded into this model to simplify their semantics in initializers as well.

- **More powerful optional unwrapping with if let** — The if let construct can now unwrap multiple optionals at once, as well as include intervening boolean conditions. This lets you express conditional control flow without unnecessary nesting.
- **New native Set data structure** — An unordered collection of unique elements that bridges with NSSet and provides value semantics like Array and Dictionary.

### Conclusion

We appreciate all of the bugs you have filed, and expect that many of the most common issues have been fixed in this beta. Swift 1.2 is a major step forward for both the language and the tools. It does include some source-incompatible changes that require updates to your code, so Xcode 6.3 includes a migrator to help automate the process. To begin the migration, click the Edit menu, then choose Convert > To Swift 1.2...



## 2015年除夕夜 Swift 1.1 添加可选类型的推断新特性

Feb 18, 2015

# [The as! Operator](https://developer.apple.com/swift/blog/?id=23)

Prior to Swift 1.2, the as operator could be used to carry out two different kinds of conversion, depending on the type of expression being converted and the type it was being converted to:

- **Guaranteed conversion** of a value of one type to another, whose success can be verified by the Swift compiler. For example, upcasting (i.e., converting from a class to one of its superclasses) or specifying the type of a literal expression, (e.g., 1 as Float).
- **Forced conversion** of one value to another, whose safety cannot be guaranteed by the Swift compiler and which may cause a runtime trap. For example downcasting, converting from a class to one of its subclasses.

Swift 1.2 separates the notions of guaranteed conversion and forced conversion into two distinct operators. Guaranteed conversion is still performed with the as operator, but forced conversion now uses the as!operator. The ! is meant to indicate that the conversion may fail. This way, you know at a glance which conversions may cause the program to crash.

The following example illustrates the change:

```
class Animal {}
class Dog: Animal {}

let a: Animal = Dog()
a as Dog		// now raises the error:  "'Animal is not convertible to 'Dog';
				// ... did you mean to use 'as!' to force downcast?"

a as! Dog		// forced downcast is allowed

let d = Dog()
d as Animal		// upcast succeeds
```

Note the analogy between the expression postfix operators ! and ? and the conversion operators as! andas?:

```
class Animal {}

class Cat: Animal {}

class Dog: Animal {
	var name = "Spot"
}

let dog: Dog? = nil
dog?.name		// evaluates to nil
dog!.name		// triggers a runtime error

let animal: Animal = Cat()
animal as? Dog	// evaluates to nil
animal as! Dog	// triggers a runtime error
```

It may be easiest to remember the pattern for these operators in Swift as: ! implies *“this might trap,”* while ?indicates *“this might be nil.”*



## Valentine's day in 2015哈哈 新beta测试新Playgrounds

Feb 24, 2015 

详情内容查看https://developer.apple.com/swift/blog/?id=24 Demo代码https://developer.apple.com/swift/blog/downloads/DemoNewFormat.zip

# [New Playgrounds](https://developer.apple.com/swift/blog/?id=24)

Xcode 6.3 beta 2 includes significant improvements to Swift playgrounds, with great features for authors. It’s now even easier to create rich, interactive playgrounds — perfect for documentation, tutorials, or samples to include with your projects.

The new playgrounds are especially useful for educators. You can insert rich instructional content with paragraph headings, diagrams, and links to additional material alongside the interactive Swift code.

New features in Xcode 6.3 playgrounds include the following:

- **Inline results** display the output of your Swift code within the main editor window. The results area can be resized and configured to show different views of the output.
- **Stylized text** is easy to add to your playground by adding special markup to your comments based on the familiar Markdown syntax. Some available styles are headings, bold, italic, lists, bullets, and links to external or bundled resources.
- **The Resources folder** bundles images and other content directly within the playground. These resources can be accessed from your Swift code or from the rich comments within the playground. *(Note: with Xcode 6.3 beta 2 use Show Package Contents in Finder to drag files into the playground’s Resources folder.)*

[The latest Xcode 6.3 beta](https://developer.apple.com/xcode/downloads/) includes the new playgrounds authoring features. These features are still evolving, so be sure to read the [release notes](https://developer.apple.com/devcenter/download.action?path=/Developer_Tools/Xcode_6.3_beta_2/Xcode_6.3_beta_2_Release_Notes.pdf) and [let us know](https://bugreport.apple.com/) of any bugs you find. [Here is a demonstration playground](https://developer.apple.com/swift/blog/downloads/DemoNewFormat.zip) to get you started.



## OC学习Swift新关键字做条件约束

Mar 12, 2015

# [Nullability and Objective-C](https://developer.apple.com/swift/blog/?id=25)

UPDATE: This post was updated to use the new _Nullable syntax in Xcode 7.

One of the great things about Swift is that it transparently interoperates with Objective-C code, both existing frameworks written in Objective-C and code in your app. However, in Swift there’s a strong distinction between optional and non-optional references, e.g. NSView vs. NSView?, while Objective-C represents boths of these two types as NSView *. Because the Swift compiler can’t be sure whether a particular NSView * is optional or not, the type is brought into Swift as an implicitly unwrapped optional, NSView!.

In previous Xcode releases, some Apple frameworks had been specially audited so that their API would show up with proper Swift optionals. Xcode 6.3 supports this for your own code with a new Objective-C language feature:*nullability annotations*.

### The Core: _Nullable and _Nonnull

At the core of this feature we have two new type annotations: _Nullable and _Nonnull. As you might expect, a_Nullable pointer may have a NULL or nil value, while a _Nonnull one should not. The compiler will tell you if you try to break the rules.

```
@interface AAPLList : NSObject <NSCoding, NSCopying>
// ...
- (AAPLListItem * _Nullable)itemWithName:(NSString * _Nonnull)name;
@property (copy, readonly) NSArray * _Nonnull allItems;
// ...
@end

// --------------

[self.list itemWithName:nil]; // warning!
```

You can use _Nullable and _Nonnull almost anywhere you can use the normal C const keyword, though of course they have to apply to a pointer type. However, in the common case there’s a much nicer way to write these annotations: within method declarations you can use the non-underscored forms nullable and nonnullimmediately after an open parenthesis, as long as the type is a simple object or block pointer.

```
- (nullable AAPLListItem *)itemWithName:(nonnull NSString *)name;
- (NSInteger)indexOfItem:(nonnull AAPLListItem *)item;
```

And for properties, you can use the same non-underscored spelling by moving the annotation into the property attributes list.

```
@property (copy, nullable) NSString *name;
@property (copy, readonly, nonnull) NSArray *allItems;
```

The non-underscored forms are nicer than the underscored ones, but you’d still need to apply them to every type in your header. To make that job easier and to make your headers clearer, you’ll want to use audited regions.

### Audited Regions

To ease adoption of the new annotations, you can mark certain regions of your Objective-C header files as*audited for nullability*. Within these regions, any simple pointer type will be assumed to be nonnull. This collapses our earlier example down into something much simpler.

```
NS_ASSUME_NONNULL_BEGIN
@interface AAPLList : NSObject <NSCoding, NSCopying>
// ...
- (nullable AAPLListItem *)itemWithName:(NSString *)name;
- (NSInteger)indexOfItem:(AAPLListItem *)item;

@property (copy, nullable) NSString *name;
@property (copy, readonly) NSArray *allItems;
// ...
@end
NS_ASSUME_NONNULL_END

// --------------

self.list.name = nil;   // okay

AAPLListItem *matchingItem = [self.list itemWithName:nil];  // warning!
```

For safety, there are a few exceptions to this rule:

- typedef types don’t usually have an inherent nullability—they can easily be either nullable or non-nullable depending on the context. Therefore, typedef types are not assumed to be nonnull, even within audited regions.
- More complex pointer types like id * must be explicitly annotated. For example, to specify a non-nullable pointer to a nullable object reference, use _Nullable id * _Nonnull.
- The particular type NSError ** is so often used to return errors via method parameters that it is always assumed to be a nullable pointer to a nullable NSError reference.

You can read more about this in the [Error Handling Programming Guide](https://developer.apple.com/go/?id=error-handling-cocoa).

### Compatibility

What if your Objective-C framework has existing code written against it? Is it safe to just change your types like this? *Yes, it is*.

- Existing compiled code that uses your framework will continue to work, i.e. the ABI does not change. This also means that existing code will not catch incorrect passing of nil at runtime.
- Existing *source* code that uses your framework may get additional warnings for current uses of unsafe behavior at compile time when you move to the new Swift compiler.
- nonnull does not affect optimization. In particular, you can still check parameters marked nonnull to see if they are actually nil at runtime. This may be necessary for backwards-compatibility.

In general, you should look at nullable and nonnull roughly the way you currently use assertions or exceptions: violating the contract is a programmer error. In particular, return values are something you control, so you should never return nil for a non-nullable return type unless it is for backwards-compatibility.

This feature was first released in Xcode 6.3 with the keywords __nullable and __nonnull. Due to potential conflicts with third-party libraries, we’ve changed them in Xcode 7 to the _Nullable and _Nonnull you see here. However, for compatibility with Xcode 6.3 we’ve predefined macros __nullable and __nonnull to expand to the new names.

### Back to Swift

Now that we’ve added nullability annotations to our Objective-C header, let’s use it from Swift:

Before annotating our Objective-C:

```
class AAPLList : NSObject, NSCoding, NSCopying { 
	// ...
	func itemWithName(name: String!) -> AAPLListItem!
	func indexOfItem(item: AAPLListItem!) -> Int

	@NSCopying var name: String! { get set }
	@NSCopying var allItems: [AnyObject]! { get }
	// ...
}
```

After annotations:

```
class AAPLList : NSObject, NSCoding, NSCopying { 
	// ...
	func itemWithName(name: String) -> AAPLListItem?
	func indexOfItem(item: AAPLListItem) -> Int

	@NSCopying var name: String? { get set }
	@NSCopying var allItems: [AnyObject] { get }
	// ...
}
```

The Swift code is now cleaner. It’s a subtle change, but it will make using your framework more pleasant.

Nullability annotations for C and Objective-C are available starting in Xcode 6.3. For more information, see the[Xcode 6.3 Release Notes](https://developer.apple.com/go/?id=xcode-6.3-beta-release-notes).





## Xcode 6.3中Playground新特性下半部分

Mar 17, 2015

# [New Playgrounds Part 2 - Sources](https://developer.apple.com/swift/blog/?id=26)

Xcode 6.3 beta 3 adds even more to the new playgrounds format introduced in the last beta. The Xcode Project Navigator now lets you easily access a new Sources folder that includes additional Swift code, as well as the Resources folder.

### Playgrounds and the Project Navigator

Playgrounds are now represented within Xcode as a bundle with a disclosure triangle that reveals Resources and Sources folders when clicked. These folders contain additional content that is easily accessible from your playground’s main Swift code. To see these folders, choose View > Navigators > Show Project Navigator (or just hit Command-1).

It is easy to drag-and-drop images and other content into the Resources folder. You may want to go back and look at the DemoNewFormat.playground file from the [previous blog post](https://developer.apple.com/swift/blog/?id=24) for another example of how these resources are stored and used (using the latest Xcode 6.3 beta 3).

### Sources Folder

The Sources folder is new in Xcode 6.3 beta 3. This folder contains additional Swift source files that your main playground code can easily access. Putting extra supporting *.swift* files into the Sources folder makes it easy to keep your playground clean and readable. Code in the Sources folder also gains a big performance benefit because this code is compiled once, and is not run in the same interactive manner as the main playground code. This allows curriculum and sample code authors to create even more interactive and exciting playgrounds while the visible code remains approachable for the reader.

### Mandelbrot Example

Here’s an example playground that calculates the complex and beautiful Mandelbrot set. This playground uses the Sources folder to demonstrate the power and added performance that it enables. To see the inner workings of [this playground](https://developer.apple.com/swift/blog/downloads/Mandelbrot.zip), examine the code within the Sources folder.

代码https://developer.apple.com/swift/blog/downloads/Mandelbrot.zip



## Xcode 6.3发布性能提升

Apr 9, 2015

# [Increasing Performance by Reducing Dynamic Dispatch](https://developer.apple.com/swift/blog/?id=27)

Like many other languages, Swift allows a class to override methods and properties declared in its superclasses. This means that the program has to determine at runtime which method or property is being referred to and then perform an indirect call or indirect access. This technique, called *dynamic dispatch*, increases language expressivity at the cost of a constant amount of runtime overhead for each indirect usage. In performance sensitive code such overhead is often undesirable. This blog post showcases three ways to improve performance by eliminating such dynamism: final, private, and Whole Module Optimization.

Consider the following example:

```
class ParticleModel {
	var point = ( 0.0, 0.0 )
	var velocity = 100.0

	func updatePoint(newPoint: (Double, Double), newVelocity: Double) {
		point = newPoint
		velocity = newVelocity
	}

	func update(newP: (Double, Double), newV: Double) {
		updatePoint(newP, newVelocity: newV)
	}
}

var p = ParticleModel()
for i in stride(from: 0.0, through: 360, by: 1.0) {
	p.update((i * sin(i), i), newV:i*1000)
}
```

As written, the compiler will emit a dynamically dispatched call to:

1. Call update on p.
2. Call updatePoint on p.
3. Get the property point tuple of p.
4. Get the property velocity of p.

This might not be what you would expect when looking at this code. The dynamic calls are necessary because a subclass of ParticleModel might override point or velocity with a computed property or overrideupdatePoint() or update() with new implementations.

In Swift, dynamic dispatch calls are implemented by looking up a function from a method table and then performing an indirect call. This is slower than performing a direct call. Additionally, indirect calls also prevent many compiler optimizations, making the indirect call even more expensive. In performance critical code there are techniques you can use to restrict this dynamic behavior when it isn’t needed to improve performance.

### Use final when you know that a declaration does not need to be overridden.

The final keyword is a restriction on a class, method, or property that indicates that the declaration cannot be overridden. This allows the compiler to safely elide dynamic dispatch indirection. For instance, in the followingpoint and velocity will be accessed directly through a load from the object’s stored property andupdatePoint() will be called via a direct function call. On the other hand, update() will still be called via dynamic dispatch, allowing for subclasses to override update() with customized functionality.

```
class ParticleModel {
	final var point = ( x: 0.0, y: 0.0 )
	final var velocity = 100.0

	final func updatePoint(newPoint: (Double, Double), newVelocity: Double) {
		point = newPoint
		velocity = newVelocity
	}

	func update(newP: (Double, Double), newV: Double) {
		updatePoint(newP, newVelocity: newV)
	}
}
```

It is possible to mark an entire class as final by attaching the attribute to the class itself. This forbids subclassing the class, implying that all functions and properties of the class are final as well.

```
final class ParticleModel {
	var point = ( x: 0.0, y: 0.0 )
	var velocity = 100.0
	// ...
}
```

### Infer final on declarations referenced in one file by applying the private keyword.

Applying the private keyword to a declaration restricts the visibility of the declaration to the current file. This allows the compiler to find all potentially overriding declarations. The absence of any such overriding declarations enables the compiler to infer the final keyword automatically and remove indirect calls for methods and property accesses.

Assuming there is no class overriding ParticleModel in the current file, the compiler can replace all dynamically dispatched calls to private declarations with direct calls.

```
class ParticleModel {
	private var point = ( x: 0.0, y: 0.0 )
	private var velocity = 100.0

	private func updatePoint(newPoint: (Double, Double), newVelocity: Double) {
		point = newPoint
		velocity = newVelocity
	}

	func update(newP: (Double, Double), newV: Double) {
		updatePoint(newP, newVelocity: newV)
	}
}
```

As in the previous example, point and velocity are accessed directly and updatePoint() is called directly. Again, update() will be invoked indirectly due to update() not being private.

Just like with final, it is possible to apply the private attribute to the class declaration itself causing the class to be private and thus all of the properties and methods of the class as well.

```
private class ParticleModel {
	var point = ( x: 0.0, y: 0.0 )
	var velocity = 100.0
	// ...
}
```

### Use Whole Module Optimization to infer final on internal declarations.

Declarations with internal access (the default if nothing is declared) are only visible within the module where they are declared. Because Swift normally compiles the files that make up a module separately, the compiler cannot ascertain whether or not an internal declaration is overridden in a different file. However, if Whole Module Optimization is enabled, all of the module is compiled together at the same time. This allows the compiler to make inferences about the entire module together and infer final on declarations with internal if there are no visible overrides.

Let’s go back to the original code snippet, this time adding some extra public keywords to ParticleModel.

```
public class ParticleModel {
	var point = ( x: 0.0, y: 0.0 )
	var velocity = 100.0

	func updatePoint(newPoint: (Double, Double), newVelocity: Double) {
		point = newPoint
		velocity = newVelocity
	}

	public func update(newP: (Double, Double), newV: Double) {
		updatePoint(newP, newVelocity: newV)
	}
}

var p = ParticleModel()
for i in stride(from: 0.0, through: times, by: 1.0) {
	p.update((i * sin(i), i), newV:i*1000)
}
```

When compiling this snippet with Whole Module Optimization the compiler can infer final on the propertiespoint, velocity, and the method call updatePoint(). In contrast, it can not be inferred that update() isfinal since update() has public access.