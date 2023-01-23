import { removeBptFrom } from '@/composables/usePool';
import { PoolToken } from '@/services/pool/types';
import { BoostedPoolMock, PoolMock } from '@/__mocks__/pool';

import { Ref, ref } from 'vue';
import { useTokenBreakdown } from './useTokenBreakdown';
import { mountComposable } from '@/tests/mount-helpers';
import { bnum } from '@/lib/utils';
import { BigNumber } from 'bignumber.js';

import * as tokensProvider from '@/providers/tokens.provider';

const rootPool = ref(BoostedPoolMock);
const bbaDaiToken = removeBptFrom(BoostedPoolMock).tokens[2];

// Assuming that user owns 15% of the pool
const userPoolPercentage = ref(new BigNumber(15)) as Ref<BigNumber>;

vi.mock('@/providers/tokens.provider');

it('Works for a parent token in a deep nested pool', async () => {
  const token = ref(bbaDaiToken);
  const shareOfParentInPool = ref(1);
  const { result } = mountComposable(() =>
    useTokenBreakdown(token, shareOfParentInPool, userPoolPercentage, rootPool)
  );

  // Hides parent token balance and fiat
  expect(result.balanceLabel.value).toEqual('');
  expect(result.userBalanceLabel.value).toEqual('');
  expect(result.fiatLabel.value).toEqual('');
  expect(result.userFiatLabel.value).toEqual('');

  expect(result.tokenWeightLabel.value).toEqual('');
});

describe('Given a boosted pool with a deep bb-a-DAI linear token, useTokenBreakdown works', () => {
  const shareOfParentInPool = ref(
    bnum(bbaDaiToken.balance)
      .div(bbaDaiToken.token?.pool?.totalShares as string)
      .toNumber()
  );

  it('for wrapped tokens (aDAi)', async () => {
    const aDaiToken = ref(bbaDaiToken.token?.pool?.tokens?.[0] as PoolToken);
    const { result } = mountComposable(() =>
      useTokenBreakdown(
        aDaiToken,
        shareOfParentInPool,
        userPoolPercentage,
        rootPool
      )
    );

    expect(result.balanceLabel.value).toEqual('24,104');
    expect(result.userBalanceLabel.value).toEqual('3,615.6517');
    //useTokens global mock is mocking priceFor to return 2
    // so fiat should be double the balance
    expect(result.fiatLabel.value).toEqual('$48,209');
    expect(result.userFiatLabel.value).toEqual('$7,231.30');

    expect(result.tokenWeightLabel.value).toEqual('');
  });

  it('for a non wrapped token (DAI)', async () => {
    const daiToken = ref(bbaDaiToken.token?.pool?.tokens?.[1] as PoolToken);
    const { result } = mountComposable(() =>
      useTokenBreakdown(
        daiToken,
        shareOfParentInPool,
        userPoolPercentage,
        rootPool
      )
    );

    expect(result.balanceLabel.value).toEqual('17,695');
    //useTokens global mock is mocking priceFor to return 2
    // so fiat should be double the balance
    expect(result.fiatLabel.value).toEqual('$35,389');

    expect(result.tokenWeightLabel.value).toEqual('');
  });
});

describe('Given a weighted pool (GRO-WETH)', () => {
  const rootPool = ref(PoolMock);
  const shareOfParentInPool = ref(1);

  it('works for GRO token', () => {
    const groToken = removeBptFrom(PoolMock).tokens[0];
    const token = ref(groToken);
    const { result } = mountComposable(() =>
      useTokenBreakdown(
        token,
        shareOfParentInPool,
        userPoolPercentage,
        rootPool
      )
    );

    expect(result.balanceLabel.value).toEqual('408,785');
    expect(result.fiatLabel.value).toEqual('$817,569');

    expect(result.tokenWeightLabel.value).toEqual('80.00%');
  });

  it('works for WETH token', () => {
    const wethToken = removeBptFrom(PoolMock).tokens[1];
    const token = ref(wethToken);
    const { result } = mountComposable(() =>
      useTokenBreakdown(
        token,
        shareOfParentInPool,
        userPoolPercentage,
        rootPool
      )
    );

    expect(result.balanceLabel.value).toEqual('95.0941');
    expect(result.fiatLabel.value).toEqual('$190.19');

    expect(result.tokenWeightLabel.value).toEqual('20.00%');
  });

  it('works WETH token', () => {
    const wethToken = removeBptFrom(PoolMock).tokens[1];
    const token = ref(wethToken);
    const { result } = mountComposable(() =>
      useTokenBreakdown(
        token,
        shareOfParentInPool,
        userPoolPercentage,
        rootPool
      )
    );

    expect(result.balanceLabel.value).toEqual('95.0941');
    expect(result.fiatLabel.value).toEqual('$190.19');

    expect(result.tokenWeightLabel.value).toEqual('20.00%');
  });

  it('Uses latestUSDPrice when the token price is not defined (fiat value is zero because priceFor returns zero when token price not found)', () => {
    //@ts-ignore
    vi.spyOn(tokensProvider, 'useTokens').mockReturnValueOnce({
      priceFor: () => 0,
    });

    const groToken = removeBptFrom(PoolMock).tokens[0];
    const token = ref(groToken);
    const { result } = mountComposable(() =>
      useTokenBreakdown(
        token,
        shareOfParentInPool,
        userPoolPercentage,
        rootPool
      )
    );

    expect(result.balanceLabel.value).toEqual('408,785');
    expect(result.fiatLabel.value).toEqual('$437,400'); // balance x latestUSDPrice = 408,785 x 1.07 = $437,400
  });
});
