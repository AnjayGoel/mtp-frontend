import React, {useState} from 'react';
import PrisonerDilemma from "./PrisonerDilemma";
import {Commands} from "../constants";

export const getGameComponent = (name: string, callback: Function) => {
  if (name === "prisoners_dilemma") {
    return <PrisonerDilemma callback={(event: any) => {
      callback(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
    }
    }/>
  }
}

export const getGameTimeout = (name: string) => {
  switch (name) {
    case "prisoners_dilemma":
      return 60 * 2;
    default:
      return 60 * 2
  }
}

export const getDefaultResp = (name: string) => {
  switch (name) {
    case "prisoners_dilemma":
      return {"action": "c", "response": 5};
    default:
      return {"action": "c", "response": 5};
  }
}
