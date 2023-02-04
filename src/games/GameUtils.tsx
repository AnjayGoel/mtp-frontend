import React from 'react';
import PrisonerDilemma from "./PrisonerDilemma";
import {Commands} from "../constants";

export const getGameComponent = (name: string, config: any, callback: Function) => {
  if (name === "prisoners_dilemma") {
    return (
      <PrisonerDilemma
        config={config}
        callback={(event: any) => {
          callback(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
        }
        }/>
    )
  }
}
