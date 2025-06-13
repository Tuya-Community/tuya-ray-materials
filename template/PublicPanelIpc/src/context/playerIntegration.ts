import React from 'react';
import { useCtx } from '@ray-js/ipc-player-integration';

type PlayerIntegrationContextType = {
  playerIntegrationInstance: ReturnType<typeof useCtx>;
};

export const PlayerIntegrationContext = React.createContext<PlayerIntegrationContextType>({
  playerIntegrationInstance: null,
});
