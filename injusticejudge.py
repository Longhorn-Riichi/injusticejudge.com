import asyncio
import sys
from InjusticeJudge.injustice_judge import analyze_game

if __name__ == "__main__":
    link = sys.argv[1]
    print("<ul>")
    for line in asyncio.run(analyze_game(link, look_for={"injustice"})):
        print(f"  <li>{line}</li>\n")
    print("</ul>")
