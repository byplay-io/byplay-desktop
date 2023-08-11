import {type BrowserWindow, ipcMain} from 'electron';
import {type IPCChannel, type MessageM2R} from '../../types/ipc';

export function subscribeMainToRenderer<Req, Res>(
  channel: IPCChannel,
  handler: (request: Req) => Promise<Res>,
) {
  ipcMain.on(channel, async (event, {respondTo, request}) => {
    const response = await handler(request);
    event.sender.send(respondTo, response);
  });
}

let win: BrowserWindow | null = null;

export function setWindowForIpc(w: BrowserWindow) {
  win = w;
}

export function sendMainToRenderer<T extends MessageM2R>(
  channel: T['channel'],
  request: T['payload'],
): void {
  win?.webContents.send(channel, request);
}
