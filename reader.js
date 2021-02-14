let folderName
let currentFile
let foldersInLibrary
let foldersInLibraryCount
let currentPage = 1
let lastPage = 0
let pageIndex = 0 // use to increment/decrement comic images
let readMode = false // activates left/right(a/d) inputs (only true when comic is loaded!)
let comicsInLibraryTitles = []
let comicPageCount = []
let comicImages = []

// Hide elements
document.getElementById('navigationTip').style.display = 'none'
document.getElementById('comicView').style.display = 'none'
document.getElementById('comicViewDivider').style.display = 'none'

// Load library elements from the /library directory
document.getElementById('locateLibrary').onchange = function locateLibraryFiles() {
    filesInLibrary = document.getElementById('locateLibrary').files
    filesInLibraryCount = filesInLibrary.length

    // Load every single page & find titles
    var i, j, tempSplit, count
    for (i = 0; i < filesInLibraryCount; i++) {
        // All pages
        tempSplit = document.getElementById('locateLibrary').files[i].webkitRelativePath

        // Check if comic exists, if not, then add titles into library
        tempSplit = tempSplit.split('/')
        if (comicsInLibraryTitles.includes(tempSplit[1]) == false) {
            comicsInLibraryTitles.push(tempSplit[1])
            console.log(`~>Found ${tempSplit[1]}`)
        }
    }

    // Find page count for every comic loaded
    count = 0
    j = 0
    for (i = 0; i < comicsInLibraryTitles.length; i++) {
        do {
            count++
            j++

            if (j < filesInLibraryCount) {
                tempSplit = document.getElementById('locateLibrary').files[j].webkitRelativePath.split('/')
            }
        } while (comicsInLibraryTitles[i] == tempSplit[1] && j < filesInLibraryCount)
                
        comicPageCount.push(count)
        count = 0
    }   

    // After scan is finished, place each comic on the library's grid
    let comicCovers = []
    var titleFound
    for (i = 0; i < comicsInLibraryTitles.length; i++) {
        // Find covers, pages & page count based on title
        for (j = 0; j < filesInLibraryCount; j++) {
            var tempSplitCover = filesInLibrary[j].webkitRelativePath.split('/')
            if (comicsInLibraryTitles[i] == tempSplitCover[1] && titleFound != tempSplitCover[1]) {
                titleFound = comicsInLibraryTitles[i]
                comicCovers.push(filesInLibrary[j])

                // Create grid element
                document.getElementById('libraryComics').innerHTML += 
                   `<div class="comicElement">
                        <p class="comicElementTitle">${comicsInLibraryTitles[i]}</p>
                        <img async src="${comicCovers[i].webkitRelativePath}" class="comicElementCover" onclick="loadComic(this)" id="${comicsInLibraryTitles[i]}">
                        <p class="comicElementPages">${comicPageCount[i]} pages</p>
                    </div>`
            }
        }   
    }
}

// Click comic and start reading
function loadComic(comic) {
    comicImages = []

    readMode = true

    var comicName = comic.id
    var comicIndex = comicsInLibraryTitles.indexOf(comicName)
    var tempSplit, i

    // Set title & page count & page index
    pageIndex = 0
    currentPage = 1
    lastPage = comicPageCount[comicIndex]
    document.getElementById('comicTitle').innerHTML = `${comicsInLibraryTitles[comicIndex]}`
    document.getElementById('pageNumber').innerHTML = `Page: ${currentPage} / ${lastPage}`

    // Find comic's images based on folder name
    for (i = 0; i < filesInLibraryCount; i++) {
        tempSplit = filesInLibrary[i].webkitRelativePath.split('/')
        if (comicName == tempSplit[1])
        {
            comicImages.push(filesInLibrary[i])
        } else if (comicImages.length != 0) {
            break
        }
    }

    // Sort images in the correct order based on image title
    comicImages.sort((a, b) => {
        let aSplit = a.webkitRelativePath.split('/')
        let bSplit = b.webkitRelativePath.split('/')
        let compareResult = aSplit[2].localeCompare(bSplit[2], undefined, {numeric: true, sensitivity: 'base'})

        return compareResult
    })

    console.log(comicImages)

    // Display first image
    currentFile = comicImages[0]
    document.getElementById('imageFrameMain').src = comicImages[0].webkitRelativePath

    // Re-display hidden elements
    document.getElementById('navigationTip').style.display = 'grid'
    document.getElementById('comicView').style.display = 'grid'
    document.getElementById('comicViewDivider').style.display = 'block'

    window.scrollTo(0, 0)
}

// Next Page
function nextPage() {
    if (currentPage < comicImages.length) {
        pageIndex++
        currentPage++

        document.getElementById('pageNumber').innerHTML = `Page: ${currentPage} / ${lastPage}`
        document.getElementById('imageFrameMain').src = comicImages[pageIndex].webkitRelativePath
        
        console.log('Go to next page.')
    } else {
        console.log('[!]No more next pages.')
    }

    document.getElementById('imageFrameMain').scrollIntoView({behavior: "smooth"})
}

// Previous Page
function prevPage() {
    if (currentPage > 1) {
        pageIndex--
        currentPage--

        document.getElementById('pageNumber').innerHTML = `Page: ${currentPage} / ${lastPage}`
        document.getElementById('imageFrameMain').src = comicImages[pageIndex].webkitRelativePath
        
        console.log('Go to previous page.')
    } else {
        console.log('[!]No more previous pages.')
    }
}

//
// KEYBOARD INPUT
// Change page with a/d or with arrow keys (left/right) (move to top of page when pressed)
window.addEventListener('keydown', changePage, false) 
function changePage(key) {
    if (readMode == true)
    {
        if (key.key == 'a' || key.key == 'A' || key.key == 'ArrowLeft' || key.key == 'α' || key.key == 'Α') {
            prevPage()
            document.getElementById('imageFrameMain').scrollIntoView({behavior: "smooth"})
        } else if (key.key == 'd' || key.key == 'D' || key.key == 'ArrowRight' || key.key == 'δ' || key.key == 'Δ') {
            nextPage()
            document.getElementById('imageFrameMain').scrollIntoView({behavior: "smooth"})
        }
    }
}

// Scroll page with w/s or with arrow keys (up/down)
window.addEventListener('keydown', scrollPage, false) 
function scrollPage(key) {
    if (readMode == true)
    {
        if (key.key == 'w' || key.key == 'W' || key.key == 'ArrowUp' || key.key == 'ς') {
            scrollBy({
                top: -150,
                left: 0,
                behavior: 'smooth'
            })
        } else if (key.key == 's' || key.key == 'S' || key.key == 'ArrowDown' || key.key == 'σ' || key.key == 'Σ') {
            scrollBy({
                top: 150,
                left: 0,
                behavior: 'smooth'
            }) 
        }
    }
}
