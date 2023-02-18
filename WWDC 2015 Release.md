## WWDC 2015后的更新内容
Swift 2和 Xcode 7


# [Strings in Swift 2](https://developer.apple.com/swift/blog/?id=30)

Swift provides a performant, Unicode-compliant string implementation as part of its Standard Library. In Swift 2, the String type no longer conforms to the CollectionType protocol, where String was previously a collection of Character values, similar to an array. Now, String provides a characters property that exposes a character collection view.

Why the change? Although it may seem natural to model a string as a collection of characters, the String type behaves quite differently from collection types like Array, Set, or Dictionary. This has always been true, but with the addition of protocol extensions to Swift 2 these differences made it necessary to make several fundamental changes.

### Different Than the Sum of Its Parts

When you add an element to a collection, you expect that the collection will contain that element. That is, when you append a value to an array, the array then contains that value. The same applies to a dictionary or a set. However, when you append a combining mark character to a string, the contents of the string itself change.

Consider the string cafe, which has four characters: c, a, f, and e:

```
var letters: [Character] = ["c", "a", "f", "e"]
var string: String = String(letters)

print(letters.count) // 4
print(string) // cafe
print(string.characters.count) // 4
```

If you append the combining acute accent character U+0301 ´ the string still has four characters, but the last character is now é:

```
let acuteAccent: Character = "\u{0301}" // ´ COMBINING ACUTE ACCENT' (U+0301)

string.append(acuteAccent)
print(string.characters.count) // 4
print(string.characters.last!) // é
```

The string’s characters property does not contain the original lowercase e, nor does it contain the combining acute accent ´ that was just appended. Instead, the string now contains a lowercase “e” with acute accent é:

```
string.characters.contains("e") // false
string.characters.contains("´") // false
string.characters.contains("é") // true
```

If we were to treat strings like any other collection, this result would be as surprising as addingUIColor.redColor() and UIColor.greenColor() to a set and the set then reporting that it containsUIColor.yellowColor().

### Judged by the Contents of Its Characters

Another difference between strings and collections is the way they determine equality.

- Two arrays are equal only if both have the same count, and each pair of elements at corresponding indices are equal.
- Two sets are equal only if both have the same count, and each element contained in the first set is also contained in the second.
- Two dictionaries are equal only if they have the same set of key, value pairs.

However, String determines equality based on being *canonically equivalent*. Characters are canonically equivalent if they have the same linguistic meaning and appearance, even if they are composed from different Unicode scalars behind the scenes.

Consider the Korean writing system, which consists of 24 letters, or *Jamo*, representing individual consonants and vowels. When written out these letters are combined into characters for each syllable. For example, the character “가” ([ga]) is composed of the letters “ᄀ” ([g]) and “ᅡ” [a]. In Swift, strings are considered equal regardless of whether they are constructed from decomposed or precomposed character sequences:

```
let decomposed = "\u{1100}\u{1161}" // ᄀ + ᅡ
let precomposed = "\u{AC00}" // 가

decomposed == precomposed // true
```

Again, this behavior differs greatly from any of Swift’s collection types. It would be as surprising as an array with values 🐟 and 🍚 being considered equal to 🍣.

### Depends on Your Point of View

Strings are not collections. But they do provide *views* that conform to CollectionType:

- characters is a collection of Character values, or [extended grapheme clusters](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/Strings/Articles/stringsClusters.html).
- unicodeScalars is a collection of [Unicode scalar values](http://www.unicode.org/glossary/#unicode_scalar_value).
- utf8 is a collection of [UTF–8](http://www.unicode.org/glossary/#UTF_8) code units.
- utf16 is a collection of [UTF–16](http://www.unicode.org/glossary/#UTF_16) code units.

If we take the previous example of the word “café”, comprised of the decomposed characters [ c, a, f, e ] and [ ´ ], here's what the various string views would consist of:

![img](https://developer.apple.com/swift/blog/images/swift-string-views.png)

- The characters property segments the text into *extended grapheme clusters*, which are an approximation of user-perceived characters (in this case: c, a, f, and é). Because a string must iterate through each of its positions within the overall string (each position is called a code point) in order to determine character boundaries, accessing this property is executed in linear O(n) time. When processing strings that contain human-readable text, high-level locale-sensitive Unicode algorithms, such as those used by thelocalizedStandardCompare(_:) method and the localizedLowercaseString property, should be preferred to character-by-character processing.
- The unicodeScalars property exposes the underlying scalar values stored in the string. If the original string were created with the precomposed character é instead of the decomposed e + ´, this would be reflected by the Unicode scalars view. Use this API when you are performing low-level manipulation of character data.
- The utf8 and utf16 properties provide code points for the UTF–8 and UTF–16 representations, respectively. These values correspond to the actual bytes written to a file when translated to and from a particular encoding. UTF-8 code units are used by many POSIX string processing APIs, whereas UTF-16 code units are used throughout Cocoa & Cocoa Touch to represent string lengths and offsets.

For more information about working with Strings and Characters in Swift, read [The Swift Programming Language](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/StringsAndCharacters.html#//apple_ref/doc/uid/TP40014097-CH7-ID285)and the [Swift Standard Library Reference](https://developer.apple.com/library/prerelease/ios//documentation/Swift/Reference/Swift_String_Structure/index.html#//apple_ref/swift/struct/s:SS).







## Xcode 7.0测试版中的新特性

Aug 12, 2015

# [Swift-er SDK](https://developer.apple.com/swift/blog/?id=31)

In Xcode 6.3 we added the new [nullability annotations](https://developer.apple.com/swift/blog/?id=25) language feature for Objective-C. This feature gave Objective-C a way to express the same sorts of null and non-null API contracts that Optionals provide in Swift. Xcode 7 continues to make communication between Objective-C and Swift more natural by introducing a lightweight generics model for Objective-C. Generics enable the two languages to safely understand and share collections containing specific kinds of elements.

These features are useful for anyone writing apps that contain both Swift and Objective-C code. But there’s a much larger collection of Objective-C code that app developers use every day: the frameworks that make up the Apple SDKs. To improve the experience of working with Swift *and* with Objective-C, we made a company-wide effort to provide this information in our SDK headers. In Xcode 7 you’ll find that nearly all of the common frameworks now specify the nullability of their APIs and the elements of their collection types. This takes our Swift interface from this:

```
class UIView : UIResponder {  
	init!(frame: CGRect)

	var superview: UIView! { get }  
	var subviews: [AnyObject]! { get }  
	var window: UIWindow! { get }

	// ...

	func isDescendantOfView(view: UIView!) -> Bool
	func viewWithTag(tag: Int) -> UIView!

	// ...

	var constraints: [AnyObject]! { get }

	// ...
}
```

To this:

```
class UIView : UIResponder {  
	init(frame: CGRect)

	var superview: UIView? { get }  
	var subviews: [UIView] { get }  
	var window: UIWindow? { get }

	// ...

	func isDescendantOfView(view: UIView) -> Bool  
	func viewWithTag(tag: Int) -> UIView?

	// ...

	var constraints: [NSLayoutConstraint] { get }

	// ...
}
```

The last piece of the puzzle is the Xcode 7 tool to convert your code to Swift 2. This tool lives in Xcode under the Edit menu as Convert > To Latest Swift Syntax. The tool takes a project that uses Swift 1.2 and applies the necessary edits to turn your code into valid Swift 2 code. These changes account for the improved header information. For instance, if you are overriding a method whose parameter and result types are now more precise, the migrator will update your method to match.

The improvements to Objective-C were detailed at WWDC in [Swift and Objective-C Interoperability](https://developer.apple.com/videos/wwdc/2015/?id=401) starting at the 14:30 mark. Note that this video uses the Xcode 6.3 __nullable syntax as opposed to the updated syntax in Xcode 7 that uses _Nullable. For more information on nullability annotations, see the blog post [Nullability and Objective-C](https://developer.apple.com/swift/blog/?id=25). For more information on Swift 2 and Objective-C lightweight generics, see the [Xcode 7 Release Notes](https://developer.apple.com/go/?id=xcode7-beta-release-notes).





## Xcode 7发布

Sep 21, 2015

# [Swift 2 Apps in the App Store](https://developer.apple.com/swift/blog/?id=32)

Swift 2 is ready for the world. You can now submit your apps that take advantage of the latest features in Swift 2 that make code more readable and powerful, including guard, the new error handling model, and availability controls.

Make sure to build your apps with [Xcode 7](https://developer.apple.com/xcode/download/) and test with the GM seed of [OS X El Capitan](https://developer.apple.com/download/), and the final versions of[iOS 9](https://developer.apple.com/ios/download/) and [watchOS 2](https://developer.apple.com/watchos/download/).

### Xcode 7 and OS X El Capitan

OS X El Capitan requires Xcode 7, which includes Swift 2, native support for System Integrity Protection (SIP), app thinning, as well as the latest SDKs. When running Xcode 7 you may notice a number of syntactical changes need to be applied to your Swift 1.2 code. To help in your migration to Swift 2, Xcode 7 includes a helpful tool to re-write older Swift code for you. Just select the menu item Edit > Convert > To Latest Swift Syntax and Xcode will migrate your code to the latest Swift API and syntax.

If your code is in the late stages of development and you must stay on Xcode 6 for a little while, you will need to continue to use OS X Yosemite as your development OS. The combination of OS X El Capitan and Xcode 6 is not supported for App Store submission due to significant changes in the underlying architecture. If you need to install OS X Yosemite on another partition or external hard drive, you can download OS X Yosemite from the App Store and [follow these instructions](https://support.apple.com/en-us/HT201372) to install it. Also note that Xcode 7 is supported on both OS X El Capitan and Yosemite.



## Xcode 7.1新特性

Oct 7, 2015

# [Literals in Playgrounds](https://developer.apple.com/swift/blog/?id=33)

New in Xcode 7.1 is the ability to embed file, image, and color literals into your playground’s code. Literals are the actual values of your data represented in their native format, directly within the Xcode editor. For instance, there’s no need to type “*myImage.jpg*” in the editor – just drag your image from the Finder and the actual image will appear in-line with your code. Instead of showing RGB values to indicate color, the playground will render a color swatch. Literals in playgrounds behave similarly to code you would otherwise hand-author in regular Swift code, but are rendered in a much more useful manner.

In addition to looking cool, literals can also make editing resources much faster. You can use the color picker to quickly choose a different color from the palette. Drag-and-drop files from the Finder into your playground code to start using them immediately. You can even add a literal at your current cursor position by selecting Editor > Insert File, Image, or Color Literal. Double-clicking a literal allows you to easily choose another value.

Resources are copied into your playground’s resources directory if needed, so everything your playground requires is included within the document. Because literals are part of your code, you can also copy, paste, move, and delete them exactly how you would any source code.

### Literals in Swift Code

Literals translate into platform-specific types, the defaults of which are listed below:

| Object Literal | OS X    | iOS and tvOS |
| :------------- | :------ | :----------- |
| Color          | NSColor | UIColor      |
| File           | NSURL   | NSURL        |
| Image          | NSImage | UIImage      |

To get the full in-line presentation experience of literals, you must be in a playground. However, if you copy and paste code that uses literals into your main Swift source code, the pasted code will work as expected and Xcode will simply render the literals as plain text.

To get you started with literals we’ve included a very short playground in this blog post. Download the latest [Xcode 7.1 beta](https://developer.apple.com/xcode/download) to give [this playground](https://developer.apple.com/swift/blog/downloads/Literals.zip) a try.

### Additional Documentation

Documentation accompanying Xcode 7.1 beta 3 includes an updated [playgrounds help document](https://developer.apple.com/library/prerelease/ios/recipes/Playground_Help/) with new information on the many powerful features in playgrounds, including new content on literals. Here are direct links to the relevant sub-pages: [Adding Image Literals](https://developer.apple.com/library/prerelease/ios/recipes/Playground_Help/Chapters/AddImageLiteral.html#//apple_ref/doc/uid/TP40015166-CH49-SW1), [Adding Color Literals](https://developer.apple.com/library/prerelease/ios/recipes/Playground_Help/Chapters/AddColorLiteral.html#//apple_ref/doc/uid/TP40015166-CH50-SW1), and [Adding File Literals](https://developer.apple.com/library/prerelease/ios/recipes/Playground_Help/Chapters/AddFileLiteral.html#//apple_ref/doc/uid/TP40015166-CH51-SW1).

Below is a screenshot demonstrating how literals appear within Xcode 7.1:



代码Playgroundhttps://developer.apple.com/swift/blog/downloads/Literals.zip





## Swift开源啦

Dec 3, 2015

# [Swift is Open Source](https://developer.apple.com/swift/blog/?id=34)

Swift is now open source. Today Apple launched the open source Swift community, as well as amazing new tools and resources including:

- [Swift.org](http://swift.org/) – a site dedicated to the open source Swift community
- Public source code repositories at [github.com/apple](http://github.com/apple)
- A new Swift package manager project for easily sharing and building code
- A Swift-native core libraries project with higher-level functionality above the standard library
- Platform support for all Apple platforms as well as Linux

Now anyone can download the code and in-development builds to see what the team is up to. More advanced developers interested in contributing to the project can file bugs, participate in the community, and contribute their own fixes and enhancements to make Swift even better. For production App Store development you should always use the stable releases of Swift included in Xcode, and this remains a requirement for app submission.

## Swift.org

Swift.org is an entirely new site dedicated to open source Swift. This site hosts resources for the community of developers that want to help evolve Swift, contribute fixes, and most importantly, interact with each other. Swift.org hosts:

- A bug reporting and tracking system
- Mailing lists
- A blog dedicated to the engineering of Swift
- Community guidelines
- Getting started tutorials
- Contributing instructions
- Documentation on Swift
- Developer and API design guidelines

Swift.org is where the daily engineering work for Swift will take place, as the community of developers work together to bring Swift to new platforms, add new features, and continually evolve our favorite language.

## Source Code

Apple has a new home on GitHub located at [github.com/apple](http://github.com/apple) where you can find all the source code for the Swift project. The public repositories include the Swift compiler, LLDB debugger and REPL, the standard and core libraries, the package manager, and other supporting projects.

GitHub is already an incredibly popular place for developers to collaborate. It is easy to view the source code right on the website, or quickly check-out the code to your machine. And when you have a patch to contribute, we accept pull requests.

## Swift Package Manager

Today we also launched a brand new project: the Swift Package Manager. This early-stage project will be developed in the open from the outset. The repository is in a very early state, and together we will define what a great package manager should do and how we can make it intuitive to use, and give it the power it needs to scale across the many platforms where we expect Swift to prosper.

## Core Libraries

Apple has long provided a rich collection of frameworks that provide higher-level functionality commonly required across a wide variety of software. Frameworks such as Foundation, libdispatch, and XCTest make it much easier to write complex programs, and we wanted to be sure that developers get those same benefits as they take their Swift skills to new platforms. Whether writing apps for iPhone or Mac, or building a new cloud service on Linux, the Swift core libraries will give you building blocks you can count on.

## Platforms

Open source Swift runs on a Mac, and is capable of building apps for OS X, iOS, watchOS, and tvOS. Swift.org also offers a Linux version of Swift, complete with a Linux toolset including package manager support, the LLDB debugger, and the REPL. We’re excited to see the community bring Swift to even more new places. As students and professionals learn to program in Swift, each new platform and use case opens new opportunities for them across the technology industry.

## Getting Started

It is easy to get started. Swift.org hosts binary downloads of the compilers and command line tools for the Apple and Linux platforms so you can be up and running quickly. The latest version of Xcode supports an alternate toolchain option specifically designed to make it simple to try out the latest open source builds of Swift from within Xcode. And Swift.org has great getting started guides to walk you through the process of setting up your environment to work with open source Swift.





## Xcode 7.3新特性 

Feb 8, 2016

# [Interactive Playgrounds](https://developer.apple.com/swift/blog/?id=35)

Xcode 7.3 beta 3 adds interactive iOS and OS X playgrounds that allow you to click, drag, type, and otherwise interact with the user interfaces you code into your playground. These interfaces react just as they would within a full application. Interactive playgrounds help you to quickly prototype and build your applications, and simply provide another great way to interact with your code.

Any view or view controller that is assigned to the liveView property of the XCPlaygroundPage is automatically made interactive, and since it runs within a playground you get all the usual playground results. You can experiment with gesture recognizers, see how UITableView creates and dequeues cells as you scroll, or interact with a complex 3D scene in SceneKit.

## Sample playground

Below is an iOS playground that uses UIKit Dynamics to create a fully-interactive and customizable [Newton’s Cradle](https://en.wikipedia.org/wiki/Newtons_cradle), perfect for your desktop.

## 代码https://developer.apple.com/swift/blog/downloads/NewtonsCradle.playground.zip





## WWDC 2016 6月13举办 更新Swift3

Jun 20, 2016

# [Swift 3 and Xcode 8](https://developer.apple.com/swift/blog/?id=36)

Swift 3 beta was just released as part of Xcode 8 beta and includes numerous enhancements, many contributed by the open source community. The primary goal of Swift 3 is to implement the last major source changes necessary to allow Swift to coalesce as a consistent language throughout, resulting in a much more stable syntax for future releases.

Swift syntax and API renaming changes in Swift 3 make the language feel more natural, and provide an even more Swift-y experience when calling Cocoa frameworks. Popular frameworks Core Graphics and Grand Central Dispatch have new, much cleaner interfaces in Swift. This release also improves build performance, and includes many small fixes that will make it more enjoyable to use every day.

[Xcode 8 beta](https://developer.apple.com/download/) includes a migrator for Swift files and playgrounds to help you move your existing code to Swift 3.

## Swift 2.3

In addition to Swift 3, Xcode 8 supports development with Swift 2.3, a minor update to the Swift 2.2 language built to work with the new SDKs for macOS Sierra, iOS 10, tvOS 10, and watchOS 3. This is intended to allow developers to immediately move to these latest SDKs, even for projects that may be late in development with Swift 2.2 and not yet ready to move to Swift 3. Xcode 8 can migrate your code to the new Swift 2.3 changes, primarily related to nullability clarity that's been added to the new SDKs. For instance:

Swift 2.2 Core Image code without the new SDK nullability definition:

```
let image = CIImage(MTLTexture: texture, options: options)
```

Swift 2.3 code makes the failable initializer more clear:

```
if let image = CIImage(MTLTexture: texture, options: options)
```

Or:

```
let image = CIImage(MTLTexture: texture, options: options)!
```

Swift 3 is the primary development language supported within Xcode 8 so there are a couple notes to consider if you chose to continue using Swift 2.3. First, Swift 2.3 and Swift 3 are not binary compatible so your app's entire code base needs to pick one version of Swift. Both versions are fully supported by the compiler, SDKs, and debugger, but other features of the IDE may not work with Swift 2.3. For instance, Playgrounds in Xcode only work with Swift 3, and notably the Swift Playgrounds app for iPad also uses Swift 3. Xcode project templates all use Swift 3, and all documentation is presented in a format appropriate for Swift 3.

When Xcode 8 is GM later this year, you will be able to submit your apps to the App Store written in either Swift 3.0 or 2.3. The changes in Swift 3 represent the future of the Swift language, and we strongly encourage you to budget time to migrate your Swift code to version 3. Even if you first migrate to Swift 2.3 in the interim, you can later run the Xcode 8 migrator to move from Swift 2.3 to Swift 3.





## iOS 10正式版推送 用Swift新功能 用于JSON

Sep 12, 2016

# [Working with JSON in Swift](https://developer.apple.com/swift/blog/?id=37)

If your app communicates with a web application, information returned from the server is often formatted as[JSON](http://www.json.org/). You can use the Foundation framework’s [JSONSerialization](https://developer.apple.com/reference/foundation/nsjsonserialization) class to convert JSON into Swift data types likeDictionary, Array, String, Number, and Bool. However, because you can’t be sure of the structure or values of JSON your app receives, it can be challenging to deserialize model objects correctly. This post describes a few approaches you can take when working with JSON in your apps.

## Extracting Values from JSON

The JSONSerialization class method jsonObject(with:options:) returns a value of type Any and throws an error if the data couldn’t be parsed.

```
import Foundation

let data: Data // received from a network request, for example
let json = try? JSONSerialization.jsonObject(with: data, options: [])
```

Although valid JSON [may contain only a single value](http://www.ecma-international.org/publications/standards/Ecma-404.htm), a response from a web application typically encodes an object or array as the top-level object. You can use optional binding and the as? type cast operator in an if orguard statement to extract a value of known type as a constant. To get a Dictionary value from a JSON object type, conditionally cast it as [String: Any]. To get an Array value from a JSON array type, conditionally cast it as [Any] (or an array with a more specific element type, like [String]). You can extract a dictionary value by key or an array value by index using type cast optional binding with subscript accessors or pattern matching with enumeration.

```
// Example JSON with object root:
/*
	{
		"someKey": 42.0,
		"anotherKey": {
			"someNestedKey": true
		}
	}
*/
if let dictionary = jsonWithObjectRoot as? [String: Any] {
	if let number = dictionary["someKey"] as? Double {
		// access individual value in dictionary
	}

	for (key, value) in dictionary {
		// access all key / value pairs in dictionary
	}

	if let nestedDictionary = dictionary["anotherKey"] as? [String: Any] {
		// access nested dictionary values by key
	}
}

// Example JSON with array root:
/*
	[
		"hello", 3, true
	]
*/
if let array = jsonWithArrayRoot as? [Any] {
	if let firstObject = array.first {
		// access individual object in array
	}

	for object in array {
		// access all objects in array
	}

	for case let string as String in array {
		// access only string values in array
	}
}
```

Swift’s built-in language features make it easy to safely extract and work with JSON data decoded with Foundation APIs — without the need for an external library or framework.

## Creating Model Objects from Values Extracted from JSON

Since most Swift apps follow the [Model-View-Controller](https://developer.apple.com/library/ios/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html) design pattern, it is often useful to convert JSON data to objects that are specific to your app’s domain in a model definition.

For example, when writing an app that provides search results for local restaurants, you might implement aRestaurant model with an initializer that accepts a JSON object and a type method that makes an HTTP request to a server’s /search endpoint and then asynchronously returns an array of Restaurant objects.

Consider the following Restaurant model:

```
import Foundation

struct Restaurant {
	enum Meal: String {
		case breakfast, lunch, dinner
	}

	let name: String
	let location: (latitude: Double, longitude: Double)
	let meals: Set<Meal>
}
```

A Restaurant has a name of type String, a location expressed as a coordinate pair, and a Set of mealscontaining values of a nested Meal enumeration.

Here’s an example of how a single restaurant may be represented in a server response:

```
{
	"name": "Caffè Macs",
	"coordinates": {
		"lat": 37.330576,
		"lng": -122.029739
	},
	"meals": ["breakfast", "lunch", "dinner"]
}
```

### Writing an Optional JSON Initializer

To convert from a JSON representation to a Restaurant object, write an initializer that takes an Any argument that extracts and transforms data from the JSON representation into properties.

```
extension Restaurant {
	init?(json: [String: Any]) {
		guard let name = json["name"] as? String,
			let coordinatesJSON = json["coordinates"] as? [String: Double],
			let latitude = coordinatesJSON["lat"],
			let longitude = coordinatesJSON["lng"],
			let mealsJSON = json["meals"] as? [String]
		else {
			return nil
		}

		var meals: Set<Meal> = []
		for string in mealsJSON {
			guard let meal = Meal(rawValue: string) else {
				return nil
			}

			meals.insert(meal)
		}

		self.name = name
		self.coordinates = (latitude, longitude)
		self.meals = meals
	}
}
```

If your app communicates with one or more web services that do not return a single, consistent representation of a model object, consider implementing several initializers to handle each of the possible representations.

In the example above, each of the values are extracted into constants from the passed JSON dictionary using optional binding and the as? type casting operator. For the name property, the extracted name value is simply assigned as-is. For the coordinate property, the extracted latitude and longitude values are combined into a tuple before assignment. For the meals property, the extracted string values are iterated over to construct aSet of Meal enumeration values.

### Writing a JSON Initializer with Error Handling

The previous example implements an optional initializer that returns nil if deserialization fails. Alternatively, you can define a type conforming to the Error protocol and implement an initializer that throws an error of that type whenever deserialization fails.

```
enum SerializationError: Error {
	case missing(String)
	case invalid(String, Any)
}

extension Restaurant {
	init(json: [String: Any]) throws {
		// Extract name
		guard let name = json["name"] as? String else {
			throw SerializationError.missing("name")
		}

		// Extract and validate coordinates
		guard let coordinatesJSON = json["coordinates"] as? [String: Double],
			let latitude = coordinatesJSON["lat"],
			let longitude = coordinatesJSON["lng"]
		else {
			throw SerializationError.missing("coordinates")
		}

		let coordinates = (latitude, longitude)
		guard case (-90...90, -180...180) = coordinates else {
			throw SerializationError.invalid("coordinates", coordinates)
		}

		// Extract and validate meals
		guard let mealsJSON = json["meals"] as? [String] else {
			throw SerializationError.missing("meals")
		}

		var meals: Set<Meal> = []
		for string in mealsJSON {
			guard let meal = Meal(rawValue: string) else {
				throw SerializationError.invalid("meals", string)
			}

			meals.insert(meal)
		}

		// Initialize properties
		self.name = name
		self.coordinates = coordinates
		self.meals = meals
	}
}
```

Here, the Restaurant type declares a nested SerializationError type, which defines enumeration cases with associated values for missing or invalid properties. In the throwing version of the JSON initializers, rather than indicating failure by returning nil, an error is thrown to communicate the specific failure. This version also performs validation of input data to ensure that coordinates represents a valid geographic coordinate pair and that each of the names for meals specified in the JSON correspond to Meal enumeration cases.

### Writing a Type Method for Fetching Results

A web application endpoint often returns multiple resources in a single JSON response. For example, a /searchendpoint may return zero or more restaurants that match the requested query parameter and include those representations along with other metadata:

```
{
	"query": "sandwich",
	"results_count": 12,
	"page": 1,
	"results": [
		{
			"name": "Caffè Macs",
			"coordinates": {
				"lat": 37.330576,
				"lng": -122.029739
			},
			"meals": ["breakfast", "lunch", "dinner"]
		},
		...
	]
}
```

You can create a type method on the Restaurant structure that translates a query method parameter into a corresponding request object and sends the HTTP request to the web service. This code would also be responsible for handling the response, deserializing the JSON data, creating Restaurant objects from each of the extracted dictionaries in the "results" array, and asynchronously returning them in a completion handler.

```
extension Restaurant {
	private let urlComponents: URLComponents // base URL components of the web service
	private let session: URLSession // shared session for interacting with the web service

	static func restaurants(matching query: String, completion: ([Restaurant]) -> Void) {
		var searchURLComponents = urlComponents
		searchURLComponents.path = "/search"
		searchURLComponents.queryItems = [URLQueryItem(name: "q", value: query)]
		let searchURL = searchURLComponents.url!

		session.dataTask(url: searchURL, completion: { (_, _, data, _)
			var restaurants: [Restaurant] = []

			if let data = data,
				let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
				for case let result in json["results"] {
					if let restaurant = Restaurant(json: result) {
						restaurants.append(restaurant)
					}
				}
			}

			completion(restaurants)
		}).resume()
	}
}
```

A view controller can call this method when the user enters text into a search bar to populate a table view with matching restaurants:

```
import UIKit

extension ViewController: UISearchResultsUpdating {
	func updateSearchResultsForSearchController(_ searchController: UISearchController) {
		if let query = searchController.searchBar.text, !query.isEmpty {
			Restaurant.restaurants(matching: query) { restaurants in
				self.restaurants = restaurants
				self.tableView.reloadData()
			}
		}
	}
}
```

Separating concerns in this way provides a consistent interface for accessing restaurant resources from view controllers, even when the implementation details about the web service change.

## Reflecting on Reflection

Converting between representations of the same data in order to communicate between different systems is a tedious, albeit necessary, task for writing software.

Because the structure of these representations can be quite similar, it may be tempting to create a higher-level abstraction to automatically map between these different representations. For instance, a type might define a mapping between snake_case JSON keys and camelCase property names in order to automatically initialize a model from JSON using the Swift reflection APIs, such as [Mirror](https://developer.apple.com/reference/swift/mirror).

However, we’ve found that these kinds of abstractions tend not to offer significant benefits over conventional usage of Swift language features, and instead make it more difficult to debug problems or handle edge cases. In the example above, the initializer not only extracts and maps values from JSON, but also initializes complex data types and performs domain-specific input validation. A reflection-based approach would have to go to great lengths in order to accomplish all of these tasks. Keep this in mind when evaluating the available strategies for your own app. The cost of small amounts of duplication may be significantly less than picking the incorrect abstraction.





## iPad新app

Sep 21, 2016

# [Use iPad to Program Robots with Swift Playgrounds](https://developer.apple.com/swift/blog/?id=38)

At WWDC 2016 we announced Swift Playgrounds, a brand new iPad app that teaches core coding concepts using Swift. In addition to the great content Apple provides with the app, we are excited to see what the community of Swift developers will build and share. We presented an in-depth session at WWDC entitled [Introducing Swift Playgrounds](https://developer.apple.com/videos/play/wwdc2016/408/) that shows how to make your own `.playgroundbook` files for iPad, with multiple pages, always-running live views, and gorgeous cut scenes.

During this WWDC session we also demonstrated controlling a Sphero SPRK+ robot on stage, driven by Swift Playgrounds on iPad. Because code in Swift Playgrounds has access to the iOS SDK, including the CoreBluetooth framework, you can write programs that can completely control devices such as these robots. We've updated the playground we demonstrated at WWDC so you can see how it works, and even extend it further to teach your robot new tricks. The playground is included in this post and can be shared to an iPad running Swift Playgrounds using iCloud, AirDrop, email, and many other methods.

When you run the code on the first page of the playground you will see a touch interface to manually drive the Sphero robot around the room. Be careful, it can get going really fast! Tapping the Next Page glyph at the top of the playground moves to additional pages. Here you have access to a simple API that enables you to use code to control the robot, making it easy to write short programs that move the robot in a square, figure eight, or any other design you can dream up.

To run this playground, you will need the Swift Playgrounds app and iOS 10 running on an iPad with a 64-bit chip. You will also need a Sphero robot capable of Bluetooth LE, like the [BB-8](http://www.sphero.com/starwars), or the new [SPRK+](http://www.sphero.com/sprk-plus). As long as the robot is nearby, the playground will find it and let you control it using Swift Playgrounds on your iPad.

You can download [Swift Playgrounds from the App Store](http://appstore.com/swiftplaygrounds).



## 十月更新

Oct 12, 2016

# [Objective-C id as Swift Any](https://developer.apple.com/swift/blog/?id=39)

Swift 3 interfaces with Objective-C APIs in a more powerful way than previous versions. For instance, Swift 2 mapped the id type in Objective-C to the AnyObject type in Swift, which normally can hold only values of class types. Swift 2 also provided implicit conversions to AnyObjectfor some bridged value types, such asString, Array, Dictionary, Set, and some numbers, as a convenience so that the native Swift types could be used easily with Cocoa APIs that expected NSString, NSArray, or the other container classes from Foundation. These conversions were inconsistent with the rest of the language, making it difficult to understand what exactly could be used as an AnyObject, resulting in bugs.

In Swift 3, the id type in Objective-C now maps to the Any type in Swift, which describes a value of any type, whether a class, enum, struct, or any other Swift type. This change makes Objective-C APIs more flexible in Swift, because Swift-defined value types can be passed to Objective-C APIs and extracted as Swift types, eliminating the need for manual “box” types. These benefits also extend to collections: Objective-C collection typesNSArray, NSDictionary, and NSSet, which previously only accepted elements of AnyObject, now can hold elements of Any type. For hashed containers, such as Dictionary and Set, there’s a new type AnyHashablethat can hold a value of any type conforming to the Swift Hashable protocol. In summary, the following type mappings change from Swift 2 to Swift 3:

| Objective-C    | Swift 2               | Swift 3            |
| :------------- | :-------------------- | :----------------- |
| id             | AnyObject             | Any                |
| NSArray *      | [AnyObject]           | [Any]              |
| NSDictionary * | [NSObject: AnyObject] | [AnyHashable: Any] |
| NSSet *        | Set<NSObject>         | Set<AnyHashable>   |

In many cases, your code will not have to change significantly in response to this change. Code that in Swift 2 relied on value types implicitly converting to AnyObject will continue to work as-is in Swift 3 by passing as Any. However, there are places where you will have to change the declared types of variables and methods and get the best experience in Swift 3. Also, if your code is explicitly using AnyObject or Cocoa classes such as NSString,NSArray, or NSDictionary, you will need to introduce more explicit casts using as NSString or as String, since the implicit conversions between the objects and value types are no longer allowed in Swift 3. The automatic migrator in Xcode will make minimal changes to keep your code compiling when moving from Swift 2 to 3, but the result may not always be the most elegant thing. This article will describe some of the changes you may need to make, as well as some pitfalls to look out for when changing your code to take advantage of id as Any.

## Overriding methods and conforming to protocols

When subclassing an Objective-C class and overriding its methods, or conforming to an Objective-C protocol, the type signatures of methods need to be updated when the parent method uses id in Objective-C. Some common examples are the NSObject class’s isEqual: method and the NSCopying protocol’s copyWithZone:method. In Swift 2, you would write a subclass of NSObject conforming to NSCopying like this:

```
// Swift 2
class Foo: NSObject, NSCopying {
	override func isEqual(_ x: AnyObject?) -> Bool { ... }
	func copyWithZone(_ zone: NSZone?) -> AnyObject { ... }
}
```

In Swift 3, in addition to making the naming change from copyWithZone(_:) to copy(with:), you will also need to change the signatures of these methods to use Any instead of AnyObject:

```
// Swift 3
class Foo: NSObject, NSCopying {
	override func isEqual(_ x: Any?) -> Bool { ... }
	func copy(with zone: NSZone?) -> Any { ... }
}
```

## Untyped Collections

Property lists, JSON, and user info dictionaries are common in Cocoa, and Cocoa natively represents these as untyped collections. In Swift 2, it was necessary to build Array, Dictionary, or Set with AnyObject orNSObject elements for this purpose, relying on implicit bridging conversions to handle value types:

```
// Swift 2
struct State {
	var name: String
	var abbreviation: String
	var population: Int

	var asPropertyList: [NSObject: AnyObject] {
		var result: [NSObject: AnyObject] = [:]
		// Implicit conversions turn String into NSString here…
		result["name"] = self.name
		result["abbreviation"] = self.abbreviation
		// …and Int into NSNumber here.
		result["population"] = self.population
		return result
	}
}

let california = State(name: "California",
					   abbreviation: "CA",
					   population: 39_000_000)
NSNotification(name: "foo", object: nil,
			   userInfo: california.asPropertyList)
```

Alternatively, you could use the Cocoa container classes, such as NSDictionary:

```
// Swift 2
struct State {
	var name: String
	var abbreviation: String
	var population: Int

	var asPropertyList: NSDictionary {
		var result = NSMutableDictionary()
		// Implicit conversions turn String into NSString here…
		result["name"] = self.name
		result["abbreviation"] = self.abbreviation
		// …and Int into NSNumber here.
		result["population"] = self.population
		return result.copy()
	}
}
let california = State(name: "California",
					   abbreviation: "CA",
					   population: 39_000_000)
// NSDictionary then implicitly converts to [NSObject: AnyObject] here.
NSNotification(name: "foo", object: nil,
			   userInfo: california.asPropertyList)
```

In Swift 3, the implicit conversions are gone, so neither of the above snippets will work as is. The migrator may suggest individually converting each value using as conversions to to keep this code working, but there’s a better solution. Swift now imports Cocoa APIs as accepting collections of Any and/or AnyHashable, so we can change the collection type to use [AnyHashable: Any] instead of [NSObject: AnyObject] or NSDictionary, without changing any other code:

```
// Swift 3
struct State {
	var name: String
	var abbreviation: String
	var population: Int

	// Change the dictionary type to [AnyHashable: Any] here...
	var asPropertyList: [AnyHashable: Any] {
		var result: [AnyHashable: Any] = [:]
		// No implicit conversions necessary, since String and Int are subtypes
		// of Any and AnyHashable
		result["name"] = self.name
		result["abbreviation"] = self.abbreviation
		result["population"] = self.population
		return result
	}
}
let california = State(name: "California",
					   abbreviation: "CA",
					   population: 39_000_000)
// ...and you can still use it with Cocoa API here
Notification(name: "foo", object: nil,
			 userInfo: california.asPropertyList)
```

## The AnyHashable Type

Swift’s Any type can hold any type, but Dictionary and Set require keys that are Hashable, so Any is too general. Starting with Swift 3, the Swift standard library provides a new type AnyHashable. Similar to Any, it acts as a supertype of all Hashable types, so values of String, Int, and other hashable types can be used implicitly as AnyHashable values, and the type inside an AnyHashable can be dynamically checked with the is,as!, or as? dynamic cast operators. AnyHashable is used when importing untyped NSDictionary or NSSetobjects from Objective-C, but is also useful in pure Swift as a way of building heterogeneous sets or dictionaries.

## Explicit Conversion for Unbridged Contexts

Under certain limited circumstances, Swift cannot automatically bridge C and Objective-C constructs. For example, some C and Cocoa APIs use id * pointers as “out” or “in-out” parameters, and since Swift is not able to statically determine how the pointer is used, it cannot perform the bridging conversions on the value in memory automatically. In cases like this, the pointer will still appear as an UnsafePointer<AnyObject>. If you need to work with one of these unbridged APIs, you can use explicit bridging conversions, written explicitly using as Type oras AnyObject in your code.

```
// ObjC
@interface Foo

- (void)updateString:(NSString **)string;
- (void)updateObject:(id *)obj;

@end
// Swift
func interactWith(foo: Foo) -> (String, Any) {
	var string = "string" as NSString // explicit conversion
	foo.updateString(&string) // parameter imports as UnsafeMutablePointer<NSString>
	let finishedString = string as String

	var object = "string" as AnyObject
	foo.updateObject(&object) // parameter imports as UnsafeMutablePointer<AnyObject>
	let finishedObject = object as Any

	return (finishedString, finishedObject)
}
```

Additionally, Objective-C protocols are still class-constrained in Swift, so you cannot make Swift structs or enums directly conform to Objective-C protocols or use them with lightweight generic classes. You will need to explicit convert String as NSString, Array as NSArray, etc. with these protocols and APIs.

## AnyObject Member Lookup

Any does not have the same magic method lookup behavior as AnyObject. This may break some Swift 2 code that looked up a property or sent a message to an untyped Objective-C object. For example, this Swift 2 code:

```
// Swift 2
func foo(x: NSArray) {
	// Invokes -description by magic AnyObject lookup
	print(x[0].description)
}
```

will complain that description is not a member of Any in Swift 3. You can convert the value withx[0] as AnyObject to get the dynamic behavior back:

```
// Swift 3
func foo(x: NSArray) {
	// Result of subscript is now Any, needs to be coerced to get method lookup
	print((x[0] as AnyObject).description)
}
```

Alternatively, force-cast the value to the concrete object type you expect:

```
func foo(x: NSArray) {
	// Cast to the concrete object type you expect
	print((x[0] as! NSObject).description)
}
```

## Swift Value Types in Objective-C

Any can hold *any* struct, enum, tuple, or other Swift type you can define in the language. The Objective-C bridge in Swift 3 can in turn present any Swift value as an id-compatible object to Objective-C. This makes it much easier to store custom Swift value types in Cocoa containers, userInfo dictionaries, and other objects. For example, in Swift 2, you would need to either change your data types into classes, or manually box them, to attach their values to an NSNotification:

```
// Swift 2
struct CreditCard { number: UInt64, expiration: NSDate }

let PaymentMade = "PaymentMade"

// We can't attach CreditCard directly to the notification, since it
// isn't a class, and doesn't bridge.
// Wrap it in a Box class.
class Box<T> {
	let value: T
	init(value: T) { self.value = value }
}

let paymentNotification =
	NSNotification(name: PaymentMade,
				   object: Box(value: CreditCard(number: 1234_0000_0000_0000,
												 expiration: NSDate())))
```

With Swift 3, we can do away with the box, and attach the object directly to the notification:

```
// Swift 3
let PaymentMade = Notification.Name("PaymentMade")

// We can associate the CreditCard value directly with the Notification
let paymentNotification =
	Notification(name: PaymentMade,
				 object: CreditCard(number: 1234_0000_0000_0000,
									expiration: Date()))
```

In Objective-C, the CreditCard value will appear as an id-compatible, NSObject- conforming object that implements isEqual:, hash, and description using Swift’s Equatable, Hashable, andCustomStringConvertible implementations if they exist for the original Swift type. From Swift, the value can be retrieved by dynamically casting it back to its original type:

```
// Swift 3
let paymentCard = paymentNotification.object as! CreditCard
print(paymentCard.number) // 1234000000000000
```

Be aware that, in Swift 3.0, some common Swift and Objective-C struct types will bridge as opaque objects instead of as idiomatic Cocoa objects. For instance, whereas Int, UInt, Double, and Bool bridge toNSNumber, the other sized numeric types such as Int8, UInt16, etc. only bridge as opaque objects. Cocoa structs such as CGRect, CGPoint, and CGSize also bridge as opaque objects even though most Cocoa API that works with them as objects expects them boxed in NSValue instances. If you see errors likeunrecognized selector sent to _SwiftValue, that indicates that Objective-C code is trying to invoke a method on an opaque Swift value type, and you may need to manually box that value in an instance of the class the Objective-C code expects.

One particular issue to look out for is Optionals. A Swift Any can hold *anything*, including an Optional, so it becomes possible to pass a wrapped Optional to an Objective-C API without checking it first, even if the API is declared as taking a nonnull id. This will generally manifest as a runtime error involving _SwiftValue rather than a compile-time error. Swift 3.0.1 included in Xcode 8.1 beta handles number types, Objective-C structs, and Optionals transparently by implementing these proposals that address the aforementioned limitations inNSNumber, NSValue, and Optional bridging:

- [SE–0139: Bridge Numeric Types to NSNumber and Cocoa Structs to NSValue](https://github.com/apple/swift-evolution/blob/master/proposals/0139-bridge-nsnumber-and-nsvalue.md)
- [SE–0140: Warn when Optional converts to Any, and bridge Optional As Its Payload Or NSNull](https://github.com/apple/swift-evolution/blob/master/proposals/0140-bridge-optional-to-nsnull.md)

To avoid forward compatibility problems, you should not rely on implementation details of opaque objects of the_SwiftValue class, since future versions of Swift may allow more Swift types to bridge to idiomatic Objective-C classes.

## Linux Portability

Swift programs running on Linux with the Swift Core Libraries use a version of Foundation natively written in Swift, without an Objective-C runtime to bridge to. id-as-Any allows the Core Libraries to use the native Swift Anyand standard library value types directly, while remaining compatible with code on Apple platforms using the Objective-C Foundation implementation. Since Swift does not interoperate with Objective-C on Linux, there is no support for bridging conversions such as string as NSString or value as AnyObject. Swift code that intends to be portable across Cocoa and the Swift Core Libraries should use the value types exclusively.

## Learning More

id-as-Any is a great example of a Swift language improvement inspired by user feedback with earlier versions of Swift and refined by review from the open Swift Evolution process. If you want to learn more about the motivations and design decisions behind id-as-Any, the original Swift Evolution proposals are available on GitHub in the swift-evolution repository:

- [SE-0072: Fully eliminate implicit bridging conversions from Swift](https://github.com/apple/swift-evolution/blob/master/proposals/0072-eliminate-implicit-bridging-conversions.md)
- [SE–0116: Import Objective-C id as Swift Any type](https://github.com/apple/swift-evolution/blob/master/proposals/0116-id-as-any.md)
- [SE–0131: Add AnyHashable to the standard library](https://github.com/apple/swift-evolution/blob/master/proposals/0131-anyhashable.md)

The net result is that Swift is a more consistent language, and Cocoa APIs become more powerful when used from Swift.



 对比Swift开源后的Swift.org博文内容的区别



**Final Cut Pro 10.1.3**

- Fixes reliability issues when burning a Blu-ray Disc or creating a Blu-ray disk image
- Color corrections you paste between clips are retained during Share
- Effects you apply to clips in the browser in prior versions of the app are retained when adding those clips to the timeline
- XML round-trip imports correctly when using gap clips
- Improves reliability of automatic library backups
- Improves stability when skimming growing files in the Browser

 

**Final Cut Pro 10.1.2**

- Optimized, proxy, and rendered media can be stored at any location outside of the library
- View and set storage locations for each of your libraries using the Library Properties inspector
- Easily delete optimized, proxy, and rendered media from within Final Cut Pro
- Used media indicators for Compound, Multicam, and Synced clips
- Option to show only unused media in the Browser
- Apply a standard (Rec. 709) look in real time to high dynamic range and wide color gamut video from ARRI, Blackmagic Design, Canon, and Sony cameras
- Automatically apply an ARRI embedded 3D LUT from the new AMIRA camera
- Support for Apple ProRes 4444 XQ
- Improved speed and accuracy when synchronizing clips
- Audio recording improvements including countdown and automatic Audition creation from multiple takes
- Fast export of cuts-only projects containing XDCAM media
- Export entire library as a single XML file
- Selecting a library displays key metadata in the Inspector
- Adjust relative and absolute volume of a clip or range selection
- Create keywords from Finder Tags when importing media
- Option to sort events by date or name in the Libraries list
- Import a clip by dragging directly into the Browser
- Share 4K video to Vimeo

Final Cut Pro 10.1.2 also addresses the following issues

- Faster opening, closing, copying, and overall performance when working with large libraries
- Linear and smooth motion interpolation between keyframes applies to both time and distance

 

**Final Cut Pro 10.1.1**

- Preserves media files if an external drive or network is disconnected while consolidating a library
- Resolves an issue with loading audio content in the Music and Sound Browser
- Fixes a stability issue when applying a Motion effect with Scroll Text behavior
- Faster switching between proxy media and original or optimized media
- Improves Timeline responsiveness with very large projects

 

**Final Cut Pro 10.1**

- Optimized playback and rendering using dual GPUs in the new Mac Pro
- Video monitoring up to 4K via Thunderbolt 2 and HDMI on select Mac computers
- 4K content including titles, transitions, and generators
- Libraries allow you to gather multiple events and projects within a single bundle
- Easily open and close individual libraries to load just the material you need
- Option to import camera media to locations inside or outside of a library
- Automatically back up libraries to a user-specified drive or network location
- Project Snapshots let you quickly capture the project state for fast versioning
- Audio fade handles on individual audio channels in the timeline
- Add precise retime speeds by entering them numerically in the timeline
- Non-rippling retime option
- One step Replace and retime
- Custom project frame sizes
- Through edits displayed on all clip types
- Join Through Edit command removes bladed cuts to clips in the timeline
- Detach audio with Multicam clips in the timeline to manipulate audio and video separately
- Make video- or audio-only edits into the timeline with Multicam Clips as sources
- Blade and move audio in J- and L-cuts
- Ability to roll audio with J- and L-cut splits open
- Option to hide the Event browser to gain more screen space for viewing
- Native support for .MTS and .MT2S files from AVCHD cameras
- Used media indicators on source clips
- Improved performance with large projects
- Improved performance when modifying or adding keywords to many clips at once
- Easily move, copy, and paste multiple keyframes
- Option for the linear animation with Ken Burns effect
- Improved image stabilization with InertiaCam and Tripod mode
- Import photos from iOS devices
- Proxy and playback quality controls accessible in Viewer menu
- Support for portrait/landscape metadata in still images
- Effects parameters, fonts, and text size included in XML metadata
- Improved support for growing media and edit while ingest
- API for custom Share operations using third-party software
- FxPlug 3 with custom plug-in interfaces and dual-GPU support
- Share directly to YouTube at 4K resolution
- Share directly to Chinese video sites Youku and Tudou
- Spanish language localization

Final Cut Pro 10.1 also improves overall stability and performance, and addresses the following issues:

- Loading a library from a SAN is significantly faster
- You can eject drives after the libraries on those drives are closed
- It is much easier to move clips with transitions in the timeline and lift them out of the Primary Storyline with transitions preserved
- Clips can be trimmed completely out of a timeline when using the rolling trim function
- Media management functions can be cancelled with undo
- Quitting the application cancels background processes
- 5.1 surround sound audio originating from a camera as AVCHD will no longer be down mixed to stereo during import
- If you have transcoded RED RAW files to ProRes through a third-party application, you can relink to the original RED files within Final Cut Pro
- Transform correctly maintains linear motion on all keyframes

 

**Final Cut Pro 10.0.9**

- Addresses issues resulting in green artifacts when using Sony XAVC media
- Fixes several issues related to interlaced media and retimed segments which could cause exports to not complete
- Includes stability improvements

 

**Final Cut Pro 10.0.8**

- Support for Sony XAVC codec up to 4K resolution
- Option to display ProRes Log C files from ARRI ALEXA cameras with standard Rec. 709 color and contrast levels
- Resolves an issue where some third-party effects generated green frames during render
- Resolves performance issues that could occur with certain titles and effects
- Time reversed clips render in the background
- Ability to use key commands to adjust Clip Appearance settings in the timeline
- Ability to view reel number metadata located in the timecode track of video files
- Mono audio files in a surround project export with correct volume levels
- Drop zones no longer reset to the first frame of video after application restart
- Fixes a performance issue which resulted from selecting multiple ranges on a single clip
- Fixes an issue where the Play Around function did not work properly on certain clips when viewed through external video devices

 

**Final Cut Pro 10.0.7**

- The Letterbox effect "Offset" slider is restored
- Fixes an issue that could occur when creating a single layer DVD
- Fixes an issue in which some third-party effects could cause Final Cut Pro to stop responding during background rendering
- Fixes an issue in which some third-party transitions would incorrectly use black instead of source media
- Adds support for editing MXF files that are still ingesting
- Fixes an issue with rendering Motion Templates containing Image Units
- Fixes an issue with the display of the Modify RED RAW settings button in synchronized and compound clips
- Fixes an issue with the upload of clips that are larger than 1 GB to Vimeo
- Fixes an issue in which an incorrect frame size is used with filters on two adjacent clips with different pixel aspect ratio

 

**Final Cut Pro 10.0.6**

- Expand multichannel audio files directly in the timeline for precise editing of individual audio channels
- Unified import window provides single interface for transferring media from file-based cameras, networks, and folders of files. Choose between Filmstrip and List views for browsing media, and save frequently used locations to the Favorites sidebar for fast access
- Redesigned Share interface for streamlined exporting. Deliver to multiple destinations in one step by creating a custom Bundle.
- Export a selected range in the Event Browser or the project timeline
- RED camera support with native REDCODE RAW editing up to 5K and optional transcode to Apple ProRes 4444 or ProRes Proxy. Ability to adjust RAW images with debayer controls directly in Final Cut Pro
- MXF plug-in support that allows you to work natively with MXF files from import through delivery using third-party plug-ins. This is ideal for importing archived media with custom metadata and exporting media with metadata to an asset management system.
- Dual viewers, each with a video scope display, let you compare shots to match action and color. Scopes include a vertical layout option so they can be displayed below the Viewer and the Event Viewer
- Ability to add chapter markers in the timeline for export to video files, DVD, and Blu-ray disc, with an option for setting custom poster frames
- Range selection now preserves start and end points on clips in the Event Browser. Use the Command key to create multiple range selections, even on a single clip
- Paste attributes window lets you choose specific effects to copy between clips
- Flexible Clip Connections allow you to keep Connected Clips in place by pressing the ` key when slipping, sliding or moving clips in the Primary Storyline
- Add a freeze frame to your timeline with a single keystroke (Option-F)
- Apply a drop shadow effect with intuitive onscreen controls to adjust position, edge falloff, angle, and more
- Combine audio from different angles within a Multicam Clip (Command-Option-click in the Angle Viewer)
- Compound Clip creation in the timeline now saves the clip in the Event Browser for re-use in other projects. Changes to the original Compound Clip will update all copies of that Compound Clip across projects. The Reference New Parent Clip command allows you to select any Compound Clip in the timeline and save a duplicate to an event in a single step
- XML 1.2 features improved metadata import and export for richer integration with third-party app
- Blade All command allows the blade tool to cut across all storylines and connected clips in a single click. Press Shift while blading to blade all
- Select a new default transition by Control-clicking on the thumbnail in the Transitions Browser and choosing Make Default. The default transition can be applied to any clip by pressing Command-T

Final Cut Pro 10.0.6 improves overall stability and performance, and adds these fixes:

- Background Rendering uses the GPU on the graphics card, enabling CPU-based processes like transcoding and proxy creation to continue uninterrupted while effects are rendering
- Loop Play with Play Selection enabled will continuously loop playback while making adjustments in the Inspector
- DSLRs and other cameras that use the Picture Transfer Protocol (PTP) for data transfer will now appear in the Import window when directly connected to the computer
- Improves system performance and smaller project sizes when working with Compound Clips
- Clicking on a clip in the timeline selects the clip without moving the playhead. Option-clicking on a clip selects the clip and moves the playhead
- Custom metadata views can be created and used as presets for exporting XML. Importing XML with custom metadata fields preserves data in Final Cut Pro
- Ability to manually tag clips as anamorphic using the Anamorphic Override option in the Inspector
- When duplicating an event or project where media resides on shared storage, only the links will be copied. This speeds up duplicating or moving events and projects to another editing station that is linked to the same shared media
- Improves behavior when moving clips to different vertical positions in the timeline
- Generators now support the 1.8:1 aspect ratio, which is used with a range of frame sizes
- Video dissolves now default to the linear Video look instead of the Film look that includes some ease in and ease out
- Ability to import SDII audio files

 

**Final Cut Pro 10.0.5**

- Final Cut Pro 10.0.5 improves overall stability and is enhanced for the MacBook Pro (Retina, Mid 2012)
- Fixes an issue in which changes were not properly saved when working off a SAN
- Improves performance when switching between projects on a SAN
- Fixes an issue which could lead to Multicam Clips losing their Roles after relaunching Final Cut Pro
- Allows for YouTube uploads longer than 15 minutes
- Correctly marks in and out points for spanned clips imported using the Sony Camera Import Plug-in PDZK-LT2

 

**Final Cut Pro 10.0.4**

- Improves image quality and responsiveness of broadcast monitoring with compatible third-party PCIe and Thunderbolt I/O devices
- Improves performance of multicam syncing and editing
- Adds language support for Simplified Chinese
- Adds a Share option for 1080p video on compatible iOS devices

Final Cut Pro 10.0.4 also addresses the following issues:

- Assigns default audio channel setting for new projects to stereo
- Includes multicam metadata in XML project export
- Fixes an issue in which video superimposed over a background with an alpha channel could appear differently in Viewer before and after render
- Fixes an issue that caused some titles to be rendered again after each application launch

 

**Final Cut Pro 10.0.3**

- Multicam editing with automatic sync and support for mixed formats, mixed frame rates, and up to 64 camera angles
- Advanced chroma keying with controls for color sampling and edge quality
- Media relink for manual reconnect of projects and Events to new media
- Ability to import and edit layered Photoshop graphics
- XML 1.1 with support for primary color grades, effect parameters, and audio keyframes
- Multiple improvements to the Color Board, including new key commands, editable numeric fields, and adjustable parameters that act like infinite sliders when dragged
- Ability to reorder color corrections in the Inspector
- Reveal in Event Browser shows clip range in the filmstrip while in List View
- Batch offset for clip date and time
- Ability to search text added to Favorite and Reject ranges
- Beta version of broadcast monitoring with third-party PCIe and Thunderbolt I/O devices

Final Cut Pro 10.0.3 also improves overall stability and performance, and addresses the following issues:

- Improves performance when editing text in titles
- Improves performance when applying an effect from the Effect Browser
- Improves keyframing behavior in the Inspector, with keyframes automatically added when moving to a new point in time and adjusting a parameter
- Modifies transition behavior so that all newly added transitions use available media and maintain project length
- Fixes an issue which affected audio solo while skimming
- Resolves issues related to using Synchronize Clips with media containing a silent audio channel
- Fixes an issue in which constant speed retiming was not properly applied when using the Paste Effects command

 

**Final Cut Pro 10.0.2**

- Fixes an issue in which a title may revert to the default font after restarting Final Cut Pro
- Resolves an issue that could cause files recorded with certain third-party mobile devices to play back incorrectly
- Addresses a stability issue caused by changing the start time on a Compound Clip

 

**Final Cut Pro 10.0.1**

- Export audio and video stems as a single multitrack QuickTime movie or as separate files using Roles
- Import and export XML to support third-party workflows
- Place Projects and Events on Xsan to improve collaboration between editors
- Set custom starting timecode for your projects
- Add transitions to connected clips in a single step
- Enable full-screen view in OS X Lion
- Speed up delivery with GPU-accelerated export
- Access the new Tribute theme, with four animated titles and a matching transition

This update also improves overall stability and performance, and addresses the following issues:

- Adds the ability to import DSLR video from Aperture and iPhoto libraries through the Photos Browser
- Adds the ability to eject camera cards while Final Cut Pro is open
- Adds the ability to always use the startup volume or Time Machine volumes for media storage
- Improves audio syncing performance and ability to sync different frame sizes and frame rates
- Fixes an issue in which alpha channels in transitions were not properly preserved
- Resolves an issue that could cause titles to accidentally move in the timeline
- Improves the quality of video retiming when applying slow motion or when working with interlaced video
- Fixes an issue in which custom ICC color profiles affected the image in the Viewer
- Improves the performance and reliability of automatic saving

Information about products not manufactured by Apple, or independent websites not controlled or tested by Apple, is provided without recommendation or endorsement. Apple assumes no responsibility with regard to the selection, performance, or use of third-party websites or products. Apple makes no representations regarding third-party website accuracy or reliability. [Contact the vendor](http://support.apple.com/kb/HT2693) for additional information.

update 2021
