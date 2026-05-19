#!/usr/bin/env bash
# Build the thesis PDF.
#   ./build.sh         -> compile main.pdf (incremental)
#   ./build.sh clean   -> remove aux files + main.pdf
#   ./build.sh full    -> clean then build
#   ./build.sh publish -> full build, then copy main.pdf to ../assets/papers/cv.pdf
set -e
cd "$(dirname "$0")"

case "${1:-build}" in
    build)
        latexmk -pdf -interaction=nonstopmode main.tex
        ;;
    clean)
        latexmk -C main.tex
        rm -f main.bbl main.blg main.synctex.gz
        ;;
    full)
        latexmk -C main.tex
        rm -f main.bbl main.blg main.synctex.gz
        latexmk -pdf -interaction=nonstopmode main.tex
        ;;
    publish)
        latexmk -C main.tex
        rm -f main.bbl main.blg main.synctex.gz
        latexmk -pdf -interaction=nonstopmode main.tex
        cp main.pdf ../assets/papers/cv.pdf
        echo "Copied main.pdf -> ../assets/papers/cv.pdf"
        ;;
    *)
        echo "Usage: $0 [build|clean|full|publish]"
        exit 1
        ;;
esac
