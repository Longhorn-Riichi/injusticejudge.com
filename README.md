[![Build Status](https://gitlab.com/pages/jekyll/badges/master/pipeline.svg)](https://gitlab.com/pages/jekyll/-/pipelines?ref=master)
![Jekyll Version](https://img.shields.io/gem/v/jekyll.svg)

# InjusticeJudge

Analyzes your Mahjong Soul, `tenhou.net`, or Riichi City game to find instances of mahjong injustice. Currently, it checks for:

- Your tenpai was chased with a worse wait and you deal into it
- You experience iishanten hell (9+ draws)
- You start with 5+ shanten
- You lost points to someone's first-row ron or tsumo
- As dealer you lost points to a baiman+ tsumo
- Someone else had a bad wait ippatsu tsumo
- You just barely fail nagashi (due to the draw or a call)
- You deal into someone with your riichi tile (or tile that got you into tenpai)
- You draw a tile that would have completed a past tenpai wait
- You dealt in with what would have been the final discard of the round, while tenpai
- You dealt into any of: dama, ippatsu, houtei, double/triple ron, ura 3, or closed dora 3
- Your iishanten haipai got reset due to an abortive draw
- You reached yakuman tenpai and did not win
- You got head bumped
- You were haneman+ tenpai but someone else won with a below-mangan hand
- You dropped placement only because the winner got ura
- You had a (good) 4+ sided wait and didn't win
- You dealt into chankan while tenpai
- You had an early 8 outs ryanmen (or better) and never folded, but didn't win
- You keep drawing honor tiles that you discard immediately (6+ times)
- You draw and discard the same tile 6 times in a row (not in tenpai)
- You discarded dora and immediately drew dora after
- Your turn was skipped by pon/kan 3 or more times
- Your tenpai wait was damaged by someone calling ankan
- You are going for honitsu but drew 6+ off-suit tiles in a row
- You're still 4-shanten or worse after the first row of discards
- You had to deal with a triple riichi in which you are the one not in riichi (and you dealt in)
- You started with 3+ dora while 4th place, but then someone else won
- Your iishanten had 0 outs (at any point in time)
- You had no safe tiles after someone's riichi and drew at least 4 dangerous tiles afterwards
- Everyone immediately discarded a dangerous tile after your riichi
- You drew into tenpai but all the discards that give you tenpai will deal in
- You could have called chii into a 4+ han tenpai but were overridden by pon/kan
- At least half of your waits were in the dead wall
- You would have drawn your tile had the game continued for five more draws
- A riichi player would have dropped your tile had the game continued for five more draws
- A previous discard passed but the very next turn you discarded the same tile and it dealt in

__Note__: This program was explicitly written to

1) be funny
2) demonstrate how common some of these perceived injustices are.

What appears as an injustice to you may be well justified from another player's perspective!
