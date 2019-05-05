// TAKEAWAYS
// to create viz with canvas, two steps are required: 1) bind the data 2) draw the viz

// set up variables
let data = []

let width = 450,
  height = 500

let groupSpacing = 4,
  cellSpacing = 2,
  offsetTop = height / 5,
  cellSize = 4

// create the initial set of data points
// 4160 = 80 * 52 (the average US lifespan in weeks)
d3.range(4160).forEach((el, index) => {
  let x1 = Math.floor(index % 10)
  let y0 = Math.floor(index / 52) * (cellSize + cellSpacing), y1 = Math.floor(index % 100 / 10)
  let x0 = ((cellSize + cellSpacing) * index) - (52 * (cellSize + cellSpacing) * (y0 / (cellSize + cellSpacing)))

  data.push({
    value: el,
    x: x0,
    y: y0,
    sourceX: x0,
    sourceY: y0,
    targetX: x0,
    targetY: y0,
    lifeSpan: 1872
   })
})

// set up the canvas by attaching it to the div container
let canvas = d3.select('#container')
  .append('canvas')
  .attr('width', width)
  .attr('height', height)

// add the tools that canvas needs to draw shapes!
let context = canvas.node().getContext('2d')

// equivalent to defining an svg element in d3
let customBase = document.createElement('custom')
let custom = d3.select(customBase)

// initial call to functions to bind data and draw rectangle elements
update()

d3.select('#move').on('click', function(d) {
  data.forEach((datum, index) => {
    let x0 = Math.floor(index / 100) % 10, x1 = Math.floor(index % 10)
    let y0 = Math.floor(index / 1000), y1 = Math.floor(index % 100 / 10)

    datum.sourceX = datum.x
    datum.sourceY = datum.y
    datum.targetX = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 20)
    datum.targetY = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 20)
    datum.x = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 20)
    datum.y = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 20)
  })

  update()
})

d3.select('#original').on('click', function (d) {
  data.forEach((datum, index) => {
    let x0 = Math.floor(index / 100) % 10, x1 = Math.floor(index % 10)
    let y0 = Math.floor(index / 1000), y1 = Math.floor(index % 100 / 10)

    datum.sourceX = datum.x
    datum.sourceY = datum.y
    datum.targetX = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10)
    datum.targetY = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10)
    datum.x = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10)
    datum.y = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10)
  })

  update()
})

function update() {
  databind(data) // bind the data

  let timer = d3.timer(elapsed => { // using d3.timer allows transitions to be shown
    draw() // draw onto the canvas context using d3.timer
    if (elapsed > 1000) { timer.stop() }
  })
}

function databind(data) {
  // let colourScale = d3.scaleSequential(d3.interpolateBrBG)
  //   .domain(d3.extent(data, d => d.value))

  // bind the data
  let join = custom.selectAll('custom.rect')
    .data(data)

  // append elements
  let enterSel = join.enter()
    .append('custom')
    .attr('class', 'rect')
    .attr('x', (d, i) => {
      return d.sourceX
    })
    .attr('y', (d, i) => {
      return d.sourceY
    })
    .attr('width', 0)
    .attr('height', 0)
    .attr('fillStyle', (d, i) => {
      // quarterly
      if (i % 13 === 0) return '#EF06BD'
      else return '#E0E0E0'

      // bi-yearly
      // if (i % 26 === 0) return '#EF06BD'
      // else return '#E0E0E0'

      // if (i < d.lifeSpan) return '#EF06BD'
      // else return '#E0E0E0'

      // return colourScale(i)
    })

  // merge allows enter and update to be combined, reducing lines of code
  join.merge(enterSel)
    .attr('x', (d, i) => {
      return d.sourceX
    })
    .attr('y', (d, i) => {
      return d.sourceY
    })
    .transition()
    .duration(1000)
    .attr('x', (d, i) => {
      return d.targetX
    })
    .attr('y', (d, i) => {
      return d.targetY
    })
    .attr('width', cellSize)
    .attr('height', cellSize)
    // fillStyle is arbitrary, it could be monkeyButts, we just need an attribute to pass information
    // to canvas so it knows what to draw
    // can't use .style!

  let exitSel = join.exit()
    .transition()
    .duration(100)
    .attr('width', 0)
    .attr('height', 0)
    .remove()
}

function draw() {
  // clears the previous canvas
  context.clearRect(0, 0, width, height)

  // select all the rectangles with data bound to them
  let elements = custom.selectAll('custom.rect')

  elements.each(function (d, i) {
    let node = d3.select(this)

    context.fillStyle = node.attr('fillStyle')
    context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'))
  })
}
