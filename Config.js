const CONFIG = {
    SOCKET : {
        SEND_KEYS : "s",
        RECEIVE : "r",
	JOIN_ROOM : "j",
	CREATE_ROOM : "c",
    },
    INPUT_SCHEMA: {
        x: -8, // -1 for left, 0 for nothing, 1 for right
        y: -8, // -1 for up, 0 for nothing, 1 for up
        r: -8 // -1 for rotate left, 0 for nothing, 1 rotate for right
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
            color: {r: 8, g: 8, b: 8},
            charge: 8,
        }],
    },
    MAP_SCHEMA: {
        walls: [[0.32]], // polygon
    }
}

if (typeof module !== "undefined" ) module.exports = CONFIG
