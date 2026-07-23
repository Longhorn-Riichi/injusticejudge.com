---
layout: blog
title: joker theory
---

<header>
  <h2>{{ page.title }}</h2>
</header>

Many mahjong variants feature __jokers__ (aka __wildcards__). For instance, Fuzhou Mahjong is like if riichi mahjong's dora indicator indicated a joker tile instead. Vietnamese Mahjong has jokers of varying powers (e.g. bamboo joker, dragon joker). There are many other jokers with different kinds of powers, but unfortunately, there is basically no theory (in English) that I can find, so that's why this post exists. We'll walk through three topics:

- Evaluating any-tile jokers
- Evaluating some-tile jokers
- Other types of jokers

## any-tile jokers

Here, an 'any-tile' joker means a tile that can stand in for any tile. In principle this allows for some fun things:

- They can be used as a 5th (6th, 7th, etc) copy of a tile (in some variants)
- You can have a single-tile wait (to complete a pair) on an any-tile joker to wait on all tiles
- You can call any tile if you have two in hand (though most variants forbid that)

We'll represent any-tile jokers with {% mahjong 2x %} in this post. You might also see tiles with 皇 or 縂, those are also any-tile jokers.

### any-tile joker shapes

Typical efficiency theory emphasizes that shapes like {% mahjong 34p %} are desirable because it waits on many tiles, therefore shapes like {% mahjong 3p2x %} must be even more so, right?

I think this reasoning reveals itself most spectacularly when you consider single-suit hands like {% mahjong 123334567789s2x %}. What is this hand waiting on? If you apply standard wait theory stuff, you could end up with:

- {% mahjong 123456s 7s2x 33s 789s %} waits on {% mahjong 356789s %}
- {% mahjong 123s 4s2x 567s 33s 789s %} waits on {% mahjong 23456s %}
- {% mahjong 1s2x 234567s 33s 789s %} waits on {% mahjong 123s %}

so it's waiting on every tile, surprise (?). If you've studied iishanten shapes, you might recognize the first two wait patterns (like {% mahjong 4s2x %}) as a __sticky tile__: a single floating tile waiting for any tile in range 2 to create a __taatsu__, i.e. {% mahjong 24s 34s 44s 45s 46s %}. Here, the joker tile can attach to any of the single-tile waits (namely {% mahjong 147s %}) and turn it into a _taatsu_ in this manner.

Unfortunately, this method is kind of unwieldy in the sense that you have to consider your hand as a massive superposition of all possible joker shapes. In the above example, we had to consider three in order to get all the waits. (I'm sure there was a better way to break that down but I am not doing it.) Anyways there is a theory that avoids this problem entirely that I don't know the name of, so let's call it "goal reduction theory".

### goal reduction theory

The above demonstrates that any-tile jokers work _globally_: unlike regular tiles that only upgrade tiles around them, any-tile jokers upgrade the entire hand. I think the best way to characterize this is to say that a joker tile reduces the goal from "get to tenpai" to "get to iishanten with a floating tile".

To see what I mean by this, let's consider tenpai hands. You can recognize a hand is __tenpai__ if you can remove groups until you find one of the following five tenpai waits:

- ryanmen {% mahjong 45p %} waiting on {% mahjong 36p %}
- penchan {% mahjong 12m %} waiting on {% mahjong 3m %}
- kanchan {% mahjong 57s %} waiting on {% mahjong 6s %}
- shanpon {% mahjong 2277z %} waiting on {% mahjong 27z %}
- tanki {% mahjong 3z %} waiting on {% mahjong 3z %}

Similarly, you can recognize a hand is [iishanten](https://youtube.com/watch?v=mKEOEWEc5JE) if you can remove groups until you find one of the following __iishanten-with-a-floating-tile__ hands:

- floating tile {% mahjong 22p 67p 34s 2x %} waiting on {% mahjong 58p25s %}
- headless {% mahjong 67p 4s 2x %} waiting on {% mahjong 58p4s %}
- sticky {% mahjong 77p 4s 2x %} waiting on {% mahjong 7p23456s %}

with the end result that your final wait becomes any of your iishanten waits. For example, if you're in floating tile iishanten with {% mahjong 22p 67p 34s 1m %}, then your wait for getting into tenpai is {% mahjong 58p25s %}, and you throw away the {% mahjong 1m %} afterwards. But if instead of a floating {% mahjong 1m %} you have a floating any-tile joker {% mahjong 22p 67p 34s 2x %}, then you're in _tenpai_ waiting for the same: {% mahjong 58p25s %}. This is because your any-tile joker {% mahjong 2x %} can be used to complete the full hand afterwards. Basically, treat your any-jokers as floating tiles that are completely useless for your hand except for the fact that having them makes your goal easier (tenpai -> iishanten).

This extends naturally to two or more any-tile jokers. With two such jokers, you want __2-shanten with two floating tiles__. There are three such 2-shanten structures:

- floating tile {% mahjong 23p 66p 34s 89s 2x 2x %} waiting on {% mahjong 14p257s %}
- sticky {% mahjong 22p 34s 9s 2x 2x %} waiting on {% mahjong 2p25789s %}
- super sticky {% mahjong 4m 9s 2x 2x %} waiting on {% mahjong 23456m789s %}

I should emphasize that getting any of these wait tiles here means __you win__. You have a very wide wait due to the two floating any-tile jokers changing your goal from tenpai to 2-shanten.

Hopefully you can see the pattern: each any-tile jokers relaxes the requirement for winning a hand. So the main thrust of __goal reduction theory__ is: with _n_ jokers, your final waits are exactly the waits for a _n_-shanten hand with _n_ (ignorable joker) floating tiles. In other words, having any-tile jokers reduces the __goal__ of your hand, and thinking this way allows you to entirely skip thinking about your hand as a superposition of many possible joker shapes like {% mahjong 3p2x %}.

<details markdown="1">
<summary>Mathing out shanten with any-tile jokers</summary>
To generalize this more, let's count the distance from having 5 sets. Count:

- each _taatsu_ {% mahjong 23p %} as contributing _dist 1_ (you need 1 tile to make it a set)
- each floating tile {% mahjong 9s %} as contributing _dist 2_ (you need 2 tiles to make it a set)
- each any-tile joker {% mahjong 2x %} as contributing _dist -1_ (it fills any _taatsu_)

Since the goal is 4 sets and a pair, dist 2 by this definition is the same thing as tenpai (0-shanten). If you sum these all up for the above '2-shanten-but-actually-tenpai' hands, you get:

- floating tile
  {% mahjong 23p %} (1)
  {% mahjong 66p %} (1)
  {% mahjong 34s %} (1)
  {% mahjong 89s %} (1)
  {% mahjong 2x %} (-1)
  {% mahjong 2x %} (-1) = dist 2
- sticky
  {% mahjong 22p %} (1)
  {% mahjong 34s %} (1)
  {% mahjong 9s %} (2)
  {% mahjong 2x %} (-1)
  {% mahjong 2x %} (-1) = dist 2
- super sticky
  {% mahjong 4m %} (2)
  {% mahjong 9s %} (2)
  {% mahjong 2x %} (-1)
  {% mahjong 2x %} (-1) = dist 2

i.e. they are all tenpai. So if you have three or more any-tile jokers, you can generalize to 3-shanten and above by using this to figure out your effective shanten (if you're a <i>nerd</i>).
</details>

## other kinds of jokers

Now that we've covered any-tile jokers, let's cover all the other jokers that exist, of which there are a lot:

<p style="text-align: center;" markdown="1"><img src="/assets/images/jokers.png" style="width: 80%;"><br><i>(image from [Chinese Wikipedia](https://zh.wikipedia.org/wiki/%E9%BA%BB%E9%9B%80%E7%89%8C#%E7%99%BE%E6%90%AD%E7%89%8C))</i></p>

I'll try my best to define how all of these are used generally, but first I'll roughly categorize these jokers into the following buckets:

- __Some-tile jokers__: jokers that are restricted to being in a specific subset of tiles, like {% mahjong 3x %} for any-suit 147, or {% mahjong 4x %} for any-number circles
- __Completion jokers__: jokers that can only be used to finish some structure, like {% mahjong 5x %} meaning "fills a kanchan"
- __Conditional jokers__: everything else has some special silly complex condition it must fulfill

Let's start with the some-tile jokers, since they're the simplest.

### some-tile jokers definition

There are quite a few some-tile jokers out there, I'll list the ones I know in this image.

<p style="text-align: center;"><img src="/assets/images/some_tile_jokers.png" style="width: 60%;"></p>

- Top row (vietnamese jokers):
  + 萬: any character tile
  + 索: any bamboo tile
  + 筒: any circle tile
  + 縂: any-tile
  + 合: any suited (number) tile
  + 喜: any wind
  + 元: any dragon
  + 花: big flower (not a joker actually)
- Second row:
  + 筒  any circle tile (again)
  + 索: any bamboo tile (again)
  + 萬: any character tile (again)
  + 番: any honor tile
  + 皇: any-tile (again)
  + 紅: tiles with red on them (depends on tile set)
  + 藍: tiles with blue on them (depends on tile set)
  + 緑: tiles with green on them (depends on tile set)
- Third and fourth row:
  + These all simply list what they stand for (e.g. 一九 is any 1 or 9, 筒索萬 is any suited tile). The only outlier is 么 which means any terminal tile (1 or 9).

Every single one of these is a some-tile joker. These joker tiles are not exactly standardized i.e. they depend on the ruleset, but this gives a general overview of what some-tile jokers look like.

<details markdown="1">
<summary>Some other some-tile jokers I know of</summary>

- 将 is always a 258 joker
- 兵 or 卒 is usually a 369 joker
- 仕 is usually a 147 joker
- 小 is 123, or 1234 joker if 中 not used
- 中 is 456
- 大 is 789, or 6789 joker if 中 not used
- 攤 is 1234
- 工 is 6789
- 單 is 13579 (odd)
- 雙 is 2468 (even)
- 質 is 2357 (any prime)
- 合成 is 4689 (any composite)
- 非質 is 14689 (any non-prime)
- 非合成 is 12357 (any non-composite)

</details>

Now let's get into the theory.

### some-tile jokers: goal reduction theory

Recall from goal reduction theory that any-tile jokers essentially let you skip one shanten per joker. With suited jokers, it is very much the same thing: let's say you have a circles joker {% mahjong 4x %}, then you can skip one shanten, but _only in the circles suit_.

To show what I mean by this, take the following example hands:

1. {% mahjong 123m 88m 12p 89p 345s 7z %}
2. {% mahjong 123m 88m 12p 89p 345s 4x %}

Hand 1 is simply 1-shanten, but hand 2 is tenpai. This is because both remaining _taatsu_ are in the circles suit, so the {% mahjong 4x %} acts identically to an any-tile joker in the sense that we can apply goal reduction: hand 2 is tenpai waiting on {% mahjong 37p %}.

Now let's swap the {% mahjong 12p %} with {% mahjong 12s %} to get:

1. {% mahjong 123m 88m 45p 12345s 7z %}
2. {% mahjong 123m 88m 45p 12345s 4x %}

This swap improves hand 1, since the {% mahjong 12p %} has become a wider {% mahjong 45s %} shape waiting on {% mahjong 36s %}. However, hand 2 can now _only_ wait on {% mahjong 36s %}, since the circles joker no longer fills that wait.

### some-tile jokers: strength comparison

So each {% mahjong 4x %} only applies to reducing the shanten contributed by circles _taatsu_, got it, does this generalize? The answer is yes: let's say you have a 147 joker {% mahjong 3x %}. This reduces shanten contributed by _taatsu_ waiting on 1, 4, or 7, namely 23, 56, 89, 11, 44, and 77. Because of this, {% mahjong 3x %} is decidedly _weaker_ than {% mahjong 4x %} for filling taatsu.

What about sticky waits? The classic sticky iishanten with an any-tile joker looks like {% mahjong 11m 6s 2x %} waiting on {% mahjong 3m45678s %}. We can contrast the two jokers here:

1. {% mahjong 11m 6s 4x %} is 1-shanten
2. {% mahjong 11m 6s 3x %} is _tenpai_ waiting on {% mahjong 3m568s %}

Obviously the circles joker {% mahjong 4x %} is useless here, but the 147 joker {% mahjong 3x %} (by virtue of filling the wait requested by any possible sticky tile) turns this into tenpai (_no matter the identity of the sticky tile_ {% mahjong 6s %}). Because of this, {% mahjong 3x %} is decidedly _stronger_ than {% mahjong 4x %} when it comes to matching sticky tiles.

In summary, some-tile jokers have strength in two dimensions: _completing taatsu_ and _matching sticky tiles_. Jokers that span a suit tend to be good at completing taatsu since they complete any taatsu of that suit. Jokers that span numbers are good at matching sticky tiles, because they can do so in any suit.

For jokers that match honor tiles, this difference is erased (no honor sequences) so there is no difference between the 'sticky' tile {% mahjong 7z %} and the taatsu {% mahjong 77z %}. Honor jokers are obviously worse than suit/number jokers, but like honor tiles themselves, they are usually better value since sets of honor tiles tend to be better for scoring reasons.

There are some-tile jokers beyond suit jokers and number jokers, but I don't think there's any usable theory for them. Skill issue on my part tbh. You will have to go to another blog that talks about joker theory.

### completion jokers definition

Other jokers do not evaluate to a fixed set of tiles like some-tile jokers do. Instead, their value comes from being able to complete a set in hand. Let's call them __completion jokers__.

Possibly the easiest example of this is {% mahjong 5x %} which fills any kanchan (closed wait) such as {% mahjong 35p %}. When you lay out your winning hand, the {% mahjong 5x %} must appear as being in the middle of the sequence {% mahjong 3p5x5p %}.

<details markdown="1">
<summary>All completion jokers I know of:</summary>

- 上: complete any sequence
- 碰: complete any triplet or quad (not concealed)
- 卡 or 卡隆: can be used to complete a kanchan (e.g. the 5 in 456)
- 偏 or 偏章: can be used to complete a penchan (e.g. the 3 in 123)
- 雀頭: can be used to complete a pair
- 兩頭: can be used to complete a ryanmen
- 龍: completes any 123/456/789 (dragon)
- 断缺: completes any set that isn't honors or includes 5 (so 234, 768, 222...888 minus 555)
- 么圍: completes any set containing a 1 or 9
- 三圍: completes any set containing a 3
- 五圍: completes any set containing a 5
- 七圍: completes any set containing a 7
- 老少: complete any 123 789 yaku
- 步高: complete any shifted sequence yaku
- 般高: complete any linked sequence yaku
- 相逢: complete any shifted triplet yaku

</details>

### completion jokers as introducing new sets

Completion jokers can be thought of as loosening the requirements for what constitutes a 'set'. Standard mahjong rules stipulate that there are sequences, and that there are triplets, and all theory is derived from this (45 ryanmen, 12 penchan, 24 kanchan, 3444 ryantan, etc.) A completion joker adds another kind of valid 'set' depending on the joker, and this creates new shapes.

For {% mahjong 5x %} in particular, it essentially upgrades any floating tile like {% mahjong 3m %} to wait on {% mahjong 15m %}. Thus having {% mahjong 5x %} on hand as a floating tile adds a new set to the game alongside sequences and triplets: the humble kanchan {% mahjong 13p %}! Just like how [fancy shapes](https://riichi.wiki/Machi) like 3444 ryantan are derived from sequences and triplets, we can derive some fancy shapes for kanchans as well, from the familar 3555 (waiting on 145), to the four-sided 3456 (waiting on 1458).

So every different completion joker adds a whole new dimension of theory, and that is why I will not be expanding on the topic further in this post. I do think their strength outrivals that of some-tile jokers, especially in the hands of a player who has studied the theory behind that specific joker (= possibly no one, based on the zero literature I have found on the subject).

### variable jokers definition

Lastly, __variable jokers__ are jokers whose identity can vary based on the game state. One possibly-familiar example is shiro pocchi, which acts as a white dragon in all cases, except it can complete any riichi hand when drawn in riichi. So its joker-ness is conditional on whether you draw it in riichi.

Another easy example of a variable riichi is the 聚 joker. This tile takes on the value of any tile that you already have a copy of, so its identity is dependent on what's in your final winning hand.

<details markdown="1">
<summary>Some other variable jokers I know of</summary>

- 生死: any tile with 0 or 4 copies publicly seen
- 現: any tile for which 1-3 copies are publicly seen (opposite of 生死)
- 獨: any tile not in hand
- 聚: any tile with another copy in hand (opposite of 獨)
- 限五: any tile in a suit you have 5 or less tiles of
- 七起: any tile in a suit you have 7 or more tiles of
- 熊: copies lowest tile in hand
- 牛: copies highest tile in hand

</details>

Unfortunately I have no idea how to strategize with these especially since I've never played with them! If you have any ideas, ping me on Discord in the main mahjong server (I'm @m.arv, note I don't check friend requests.)

### other jokers

There are some other jokers that exist but don't neatly fit into the above categorization, such as 因倍 taking the identity 'all divisors of the dice roll sum', or 馬 being a different joker based on seat: east (一伍九東) south (二六中南) west (三七發西) north (四八白北). They're effectively number jokers (i.e. some-tile jokers) but they're also conditional, so they're not regular some-tile jokers, and they aren't exactly variable jokers since they can't change identity within a hand.

So yea, good luck if your local parlor offers those jokers.









