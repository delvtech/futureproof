import { type ContractReadOptions, Drift, type ReadAdapter } from "@delvtech/drift";
import {
  type Decimal,
  type Fees,
  type FrontendStatus,
  type LQTYStake,
  type ReadableLiquity,
  type StabilityDeposit,
  Trove,
  type TroveListingParams,
  type TroveWithPendingRedistribution,
  type UserTrove,
} from "@liquity/lib-base";
import { TroveManager } from "src/abi/TroveManager";

export interface LiquityParams<A extends ReadAdapter = ReadAdapter> {
  drift?: Drift<A>;
}

export class Liquity<A extends ReadAdapter = ReadAdapter>
  implements ReadableLiquity
{
  drift: Drift<A>;

  constructor({ drift = new Drift() }: LiquityParams<A> = {}) {
    this.drift = drift;
  }

  /**
   * Get the total collateral and debt per stake that has been liquidated through redistribution.
   *
   * @remarks
   * Needed when dealing with instances of {@link @liquity/lib-base#TroveWithPendingRedistribution}.
   */
  async getTotalRedistributed(overrides?: ContractReadOptions): Promise<Trove> {
    const [collateral, debt] = await Promise.all([
      this.drift.read({
        abi: TroveManager,
        address: "0x",
        fn: "L_ETH",
        ...overrides,
      }),
      this.drift.read({
        abi: TroveManager,
        address: "0x",
        fn: "L_LUSDDebt",
        ...overrides,
      }),
    ]);

    return new Trove(, debt);
  }

  /**
   * Get a Trove in its state after the last direct modification.
   *
   * @param address - Address that owns the Trove.
   *
   * @remarks
   * The current state of a Trove can be fetched using
   * {@link @liquity/lib-base#ReadableLiquity.getTrove | getTrove()}.
   */
  getTroveBeforeRedistribution(
    address?: string,
  ): Promise<TroveWithPendingRedistribution> {}
  /**
   * Get the current state of a Trove.
   *
   * @param address - Address that owns the Trove.
   */
  getTrove(address?: string): Promise<UserTrove> {}

  /**
   * Get number of Troves that are currently open.
   */
  getNumberOfTroves(): Promise<number> {}

  /**
   * Get the current price of the native currency (e.g. Ether) in USD.
   */
  getPrice(): Promise<Decimal> {}

  /**
   * Get the total amount of collateral and debt in the Liquity system.
   */
  getTotal(): Promise<Trove> {}

  /**
   * Get the current state of a Stability Deposit.
   *
   * @param address - Address that owns the Stability Deposit.
   */
  getStabilityDeposit(address?: string): Promise<StabilityDeposit> {}

  /**
   * Get the remaining LQTY that will be collectively rewarded to stability depositors.
   */
  getRemainingStabilityPoolLQTYReward(): Promise<Decimal> {}

  /**
   * Get the total amount of LUSD currently deposited in the Stability Pool.
   */
  getLUSDInStabilityPool(): Promise<Decimal> {}

  /**
   * Get the amount of LUSD held by an address.
   *
   * @param address - Address whose balance should be retrieved.
   */
  getLUSDBalance(address?: string): Promise<Decimal> {}

  /**
   * Get the amount of LQTY held by an address.
   *
   * @param address - Address whose balance should be retrieved.
   */
  getLQTYBalance(address?: string): Promise<Decimal> {}

  /**
   * Get the amount of Uniswap ETH/LUSD LP tokens held by an address.
   *
   * @param address - Address whose balance should be retrieved.
   */
  getUniTokenBalance(address?: string): Promise<Decimal> {}

  /**
   * Get the liquidity mining contract's allowance of a holder's Uniswap ETH/LUSD LP tokens.
   *
   * @param address - Address holding the Uniswap ETH/LUSD LP tokens.
   */
  getUniTokenAllowance(address?: string): Promise<Decimal> {}

  /**
   * Get the remaining LQTY that will be collectively rewarded to liquidity miners.
   */
  getRemainingLiquidityMiningLQTYReward(): Promise<Decimal> {}

  /**
   * Get the amount of Uniswap ETH/LUSD LP tokens currently staked by an address in liquidity mining.
   *
   * @param address - Address whose LP stake should be retrieved.
   */
  getLiquidityMiningStake(address?: string): Promise<Decimal> {}

  /**
   * Get the total amount of Uniswap ETH/LUSD LP tokens currently staked in liquidity mining.
   */
  getTotalStakedUniTokens(): Promise<Decimal> {}

  /**
   * Get the amount of LQTY earned by an address through mining liquidity.
   *
   * @param address - Address whose LQTY reward should be retrieved.
   */
  getLiquidityMiningLQTYReward(address?: string): Promise<Decimal> {}

  /**
   * Get the amount of leftover collateral available for withdrawal by an address.
   *
   * @remarks
   * When a Trove gets liquidated or redeemed, any collateral it has above 110% (in case of
   * liquidation) or 100% collateralization (in case of redemption) gets sent to a pool, where it
   * can be withdrawn from using
   * {@link @liquity/lib-base#TransactableLiquity.claimCollateralSurplus | claimCollateralSurplus()}.
   */
  getCollateralSurplusBalance(address?: string): Promise<Decimal> {}

  /** @internal */
  getTroves(
    params: TroveListingParams & { beforeRedistribution: true },
  ): Promise<TroveWithPendingRedistribution[]>;

  /**
   * Get a slice from the list of Troves.
   *
   * @param params - Controls how the list is sorted, and where the slice begins and ends.
   * @returns Pairs of owner addresses and their Troves.
   */
  getTroves(params: TroveListingParams): Promise<UserTrove[]>;
  getTroves(
    params: TroveListingParams & { beforeRedistribution?: true },
  ): Promise<(TroveWithPendingRedistribution | UserTrove)[]> {}

  /**
   * Get a calculator for current fees.
   */
  getFees(): Promise<Fees> {}

  /**
   * Get the current state of an LQTY Stake.
   *
   * @param address - Address that owns the LQTY Stake.
   */
  getLQTYStake(address?: string): Promise<LQTYStake> {}

  /**
   * Get the total amount of LQTY currently staked.
   */
  getTotalStakedLQTY(): Promise<Decimal> {}

  /**
   * Check whether an address is registered as a Liquity frontend, and what its kickback rate is.
   *
   * @param address - Address to check.
   */
  getFrontendStatus(address?: string): Promise<FrontendStatus> {}
}
