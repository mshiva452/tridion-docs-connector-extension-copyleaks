import { createExtensionGlobals } from '@tridion-docs/extensions';

const { initialize: initializeGlobals, t, configuration } = createExtensionGlobals();

export { initializeGlobals, t, configuration };
