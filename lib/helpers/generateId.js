/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/

/**
* Generate a random ID name
* @returns {string} - Random ID generated
*/
function generateRandomID(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    let idGenerated = '';
    for(let i=0; i<16; i++) {
        const randomIdx = Math.floor(Math.random() * chars.length);
        idGenerated += chars.charAt(randomIdx);
    }
    return idGenerated;
}

module.exports = { generateRandomID };