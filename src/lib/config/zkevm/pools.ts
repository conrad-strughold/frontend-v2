import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {},
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: false,
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],
  IncludedPoolTypes: [
    'Weighted',
    'Stable',
    'MetaStable',
    'LiquidityBootstrapping',
    'Investment',
    'StablePhantom',
    'ComposableStable',
  ],
  Stable: {
    AllowList: [],
  },
  Investment: {
    AllowList: [''],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008',
      '0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009',
      '0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a',
    ],
  },
  Factories: {
    '0x8eA89804145c007e7D226001A96955ad53836087': 'composableStablePool', // ComposableStable v4
    '0x03F3Fb107e74F2EAC9358862E91ad3c692712054': 'weightedPool', // Weighted v4
    '0x6B1Da720Be2D11d95177ccFc40A917c2688f396c': 'erc4626Linear', // ERC4626 LinearPool
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [
      '0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a',
    ],
  },
  Metadata: {},
  Deep: [],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
};

export default pools;
