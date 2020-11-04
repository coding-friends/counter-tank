const CONFIG = {
    KEYS : "keys",
    INPUT_SCHEMA: {
        x: -8, // -1 for left, 0 for nothing, 1 for right
        y: -8, // -1 for up, 0 for nothing, 1 for up
        r: -8 // -1 for left, 0 for nothing, 1 for right
    },
    OUTPUT_SCHEMA: {
        players : [{
            x: 0.32, 
            y: 0.32, 
            r: 0.32, 
            color: {r: 8, g: 8, b: 8},
            name: "8",
        }],
        bullets: [{
            x: 0.32,
            y: 0.32,
            r: 0.32,
            charge: 8,
        }],
    },
    MAP_SCHEMA: {
        walls: [[0.32]],
    }
}

if (typeof module !== "undefined" ) module.exports = CONFIG