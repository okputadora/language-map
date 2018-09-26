# Etymology Map

## Intro
The goal of this app is to display etymologies in a tree somewhat like [this](https://drive.google.com/file/d/1DnMbxpmvJKv1D4QSfTvsv8y-9F3zOV09/view)
The user can search an English word and see its etymology in a straight line.
Then, the user can expand the tree to see other words that share the same root.

The example video shows some related German words, however, the goal would be to
to show other English words that are related but not obviously so. For example,
Lettuce and Lactate share the same Latin root (because when you cut lettuce it
excretes a milky substance 😬)

## Details
OK, cool, how do we do this...

### Data
Unfortunately there is not a good API or public dataset of etymologies.   

Some resource I've tried are [this](https://www.knaw.nl/en/news/news/etymologiebank-online) but it's for Dutch words
[this one](https://developer.oxforddictionaries.com/documentation/glossary) might be good but it's paid.
I couldn't figure out how to get the data out of the DAT files from [here](http://www1.icsi.berkeley.edu/~demelo/etymwn/)
and their TSV file looks like `afr: blom	rel:etymology	nld: bloem` <-- what the hell does that mean?

the way the application currently works in by scraping [etymonline.com](https://www.etymonline.com/), parsing the
text with a really DUMB algorithm and then saving it in a tree. I've sent out an email to the owner, asking
if he's interested in collaborating and am waiting to hear back./////////

### Visualization
