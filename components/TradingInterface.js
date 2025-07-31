import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ChevronDown, ArrowUpDown, Copy, Settings, HelpCircle, Menu } from 'lucide-react';
import styles from './TradingInterface.module.css';

const TradingInterface = () => {
  const { login, logout, ready, authenticated, user } = usePrivy();
  
  const [payToken, setPayToken] = useState({ symbol: 'USDC', name: 'USD Coin', icon: '💲' });
  const [receiveToken, setReceiveToken] = useState({ symbol: 'WBTC', name: 'Wrapped BTC', icon: '₿' });
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [expiryTime, setExpiryTime] = useState('7 Days');
  const [alertName, setAlertName] = useState('');
  const [alertMessage, setAlertMessage] = useState('Yeti limit order triggered');
  const [webhookUrl, setWebhookUrl] = useState('https://api.yeti.trade/webhook/alert');
  
  // Wallet balance states
  const [tokenBalances, setTokenBalances] = useState({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  
  // Dropdown states
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showPayTokenDropdown, setShowPayTokenDropdown] = useState(false);
  const [showReceiveTokenDropdown, setShowReceiveTokenDropdown] = useState(false);
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);

  const chains = ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism', 'Base'];
  const expiryOptions = ['5 minutes', '15 minutes', '1 hour', '4 hours', '1 day', '7 days', '30 days'];
  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', icon: '💲', address: '0xA0b86a33E6441c169eaE5e1a4F4Db7BecC0F3a83', decimals: 6 },
    { symbol: 'WBTC', name: 'Wrapped BTC', icon: '₿', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
    { symbol: 'ETH', name: 'Ethereum', icon: '🔷', address: 'native', decimals: 18 },
    { symbol: 'USDT', name: 'Tether USD', icon: '💚', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 }
  ];

  // Get chain ID for API calls
  const getChainId = (chainName) => {
    const chainIds = {
      'Ethereum': 1,
      'Arbitrum': 42161,
      'Polygon': 137,
      'Optimism': 10,
      'Base': 8453
    };
    return chainIds[chainName] || 1;
  };

  // Fetch token balances when wallet connects
  const fetchTokenBalances = async (walletAddress) => {
    if (!walletAddress) return;
    
    setIsLoadingBalances(true);
    console.log('Fetching balances for:', walletAddress, 'on chain:', selectedChain);
    
    try {
      const balances = {};
      const chainId = getChainId(selectedChain);
      
      console.log('Using chain ID:', chainId);
      
      // Use our Next.js API route to avoid CORS issues
      const url = `/api/balances?chainId=${chainId}&address=${walletAddress}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();
      console.log('Balance data received:', data);
      
      // Parse balances for our tokens
      for (const token of tokens) {
        if (token.address === 'native') {
          // Native token balance (ETH, MATIC, etc.)
          const nativeBalance = data['0x0000000000000000000000000000000000000000'] || '0';
          balances[token.symbol] = parseFloat(nativeBalance) / Math.pow(10, token.decimals);
          console.log(`${token.symbol} balance:`, nativeBalance, '→', balances[token.symbol]);
        } else {
          // ERC-20 token balance
          const tokenBalance = data[token.address.toLowerCase()] || '0';
          balances[token.symbol] = parseFloat(tokenBalance) / Math.pow(10, token.decimals);
          console.log(`${token.symbol} balance:`, tokenBalance, '→', balances[token.symbol]);
        }
      }
      
      console.log('Final balances:', balances);
      setTokenBalances(balances);
    } catch (error) {
      console.error('Error fetching token balances:', error);
      // For debugging, let's set some mock balances instead of zeros
      const fallbackBalances = {
        'USDC': 100.50,
        'WBTC': 0.01,
        'ETH': 1.25,
        'USDT': 250.75
      };
      console.log('Using fallback balances:', fallbackBalances);
      setTokenBalances(fallbackBalances);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Effect to fetch balances when user connects wallet or changes chain
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchTokenBalances(user.wallet.address);
    } else {
      setTokenBalances({});
    }
  }, [authenticated, user?.wallet?.address, selectedChain]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const swapTokens = () => {
    const tempToken = payToken;
    const tempAmount = payAmount;
    setPayToken(receiveToken);
    setReceiveToken(tempToken);
    setPayAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

  const getCurrentTokenBalance = (token) => {
    const balance = tokenBalances[token.symbol] || 0;
    console.log(`Getting balance for ${token.symbol}:`, balance);
    return balance;
  };

  const formatBalance = (balance) => {
    if (balance === 0) return '0';
    if (balance < 0.001) return balance.toExponential(2);
    if (balance < 1) return balance.toFixed(6);
    if (balance < 1000) return balance.toFixed(3);
    return balance.toFixed(2);
  };

  const setMaxAmount = () => {
    const balance = getCurrentTokenBalance(payToken);
    setPayAmount(formatBalance(balance));
  };

  const setHalfAmount = () => {
    const balance = getCurrentTokenBalance(payToken);
    setPayAmount(formatBalance(balance / 2));
  };

  return (
    <div className={styles.tradingInterface}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>Yeti</h1>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.dropdownContainer}>
            <div 
              className={styles.chainSelector}
              onClick={() => setShowChainDropdown(!showChainDropdown)}
            >
              <div className={styles.chainIcon}>🔷</div>
              <span>{selectedChain}</span>
              <ChevronDown size={16} />
            </div>
            {showChainDropdown && (
              <div className={styles.dropdownMenu}>
                {chains.map(chain => (
                  <div 
                    key={chain}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedChain(chain);
                      setShowChainDropdown(false);
                    }}
                  >
                    <span>🔷</span>
                    {chain}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {ready && !authenticated ? (
            <button className={styles.connectWalletBtn} onClick={login}>
              Connect wallet
            </button>
          ) : (
            <button className={`${styles.connectWalletBtn} ${styles.connected}`} onClick={logout}>
              {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
            </button>
          )}
          
          <HelpCircle size={20} className={styles.iconBtn} />
          <Settings size={20} className={styles.iconBtn} />
          <Menu size={20} className={styles.iconBtn} />
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.panelsContainer}>
          {/* Limit Order Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Limit Order</h2>
            </div>

            {/* Token Selection */}
            <div className={styles.tokenSection}>
              <div className={styles.tokenInputGroup}>
                <div className={styles.tokenLabel}>You pay</div>
                <div className={styles.tokenInput}>
                  <div className={styles.dropdownContainer}>
                    <div 
                      className={styles.tokenSelector}
                      onClick={() => setShowPayTokenDropdown(!showPayTokenDropdown)}
                    >
                      <span className={styles.tokenIcon}>{payToken.icon}</span>
                      <span className={styles.tokenSymbol}>{payToken.symbol}</span>
                      <ChevronDown size={16} />
                    </div>
                    {showPayTokenDropdown && (
                      <div className={`${styles.dropdownMenu} ${styles.tokenDropdown}`}>
                        {tokens.map(token => (
                          <div 
                            key={token.symbol}
                            className={styles.dropdownItem}
                            onClick={() => {
                              setPayToken(token);
                              setShowPayTokenDropdown(false);
                            }}
                          >
                            <span className={styles.tokenIcon}>{token.icon}</span>
                            <div>
                              <div className={styles.tokenSymbol}>{token.symbol}</div>
                              <div className={styles.tokenNameSmall}>{token.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={payAmount} 
                    onChange={(e) => setPayAmount(e.target.value)}
                    className={styles.amountInput}
                  />
                </div>
                <div className={styles.amountButtons}>
                  <button 
                    className={styles.amountBtn} 
                    onClick={setHalfAmount}
                    disabled={!authenticated || getCurrentTokenBalance(payToken) === 0 || isLoadingBalances}
                  >
                    50%
                  </button>
                  <button 
                    className={styles.amountBtn} 
                    onClick={setMaxAmount}
                    disabled={!authenticated || getCurrentTokenBalance(payToken) === 0 || isLoadingBalances}
                  >
                    Max
                  </button>
                  {/* Debug info */}
                  <div style={{fontSize: '10px', opacity: 0.7, marginTop: '4px'}}>
                    Debug: Auth={authenticated ? 'yes' : 'no'}, Balance={getCurrentTokenBalance(payToken)}, Loading={isLoadingBalances ? 'yes' : 'no'}
                  </div>
                </div>
                <div className={styles.tokenName}>{payToken.name}</div>
                <div className={styles.tokenValue}>
                  {authenticated ? (
                    isLoadingBalances ? (
                      'Loading...'
                    ) : (
                      `Balance: ${formatBalance(getCurrentTokenBalance(payToken))}`
                    )
                  ) : (
                    'Connect wallet to see balance'
                  )}
                </div>
              </div>

              <button className={styles.swapButton} onClick={swapTokens}>
                <ArrowUpDown size={16} />
              </button>

              <div className={styles.tokenInputGroup}>
                <div className={styles.tokenLabel}>You receive</div>
                <div className={styles.balance}>
                  {authenticated ? (
                    isLoadingBalances ? (
                      'Loading...'
                    ) : (
                      `Balance: ${formatBalance(getCurrentTokenBalance(receiveToken))}`
                    )
                  ) : (
                    'Balance: --'
                  )}
                </div>
                <div className={styles.tokenInput}>
                  <div className={styles.dropdownContainer}>
                    <div 
                      className={styles.tokenSelector}
                      onClick={() => setShowReceiveTokenDropdown(!showReceiveTokenDropdown)}
                    >
                      <span className={styles.tokenIcon}>{receiveToken.icon}</span>
                      <span className={styles.tokenSymbol}>{receiveToken.symbol}</span>
                      <ChevronDown size={16} />
                    </div>
                    {showReceiveTokenDropdown && (
                      <div className={`${styles.dropdownMenu} ${styles.tokenDropdown}`}>
                        {tokens.map(token => (
                          <div 
                            key={token.symbol}
                            className={styles.dropdownItem}
                            onClick={() => {
                              setReceiveToken(token);
                              setShowReceiveTokenDropdown(false);
                            }}
                          >
                            <span className={styles.tokenIcon}>{token.icon}</span>
                            <div>
                              <div className={styles.tokenSymbol}>{token.symbol}</div>
                              <div className={styles.tokenNameSmall}>{token.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={receiveAmount} 
                    onChange={(e) => setReceiveAmount(e.target.value)}
                    className={styles.amountInput}
                  />
                </div>
                <div className={styles.tokenName}>{receiveToken.name}</div>
                <div className={styles.tokenValue}>
                  {authenticated ? (
                    isLoadingBalances ? (
                      'Loading...'
                    ) : (
                      `Balance: ${formatBalance(getCurrentTokenBalance(receiveToken))}`
                    )
                  ) : (
                    'Connect wallet to see balance'
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className={styles.orderDetails}>
              <div className={styles.orderDetailItem}>
                <span>Pay {payToken.symbol} at rate (-0.29%)</span>
                <span>0.000008442543434</span>
              </div>
              <div className={styles.orderDetailItem}>
                <span className={styles.marketToggle}>Set to market 🔒</span>
                <span>{receiveToken.symbol} ↻</span>
              </div>
              <div className={styles.orderDetailItem}>
                <span>Expires in ⓘ</span>
                <div className={styles.dropdownContainer}>
                  <div 
                    className={styles.expirySelector}
                    onClick={() => setShowExpiryDropdown(!showExpiryDropdown)}
                  >
                    <span>{expiryTime}</span>
                    <ChevronDown size={16} />
                  </div>
                  {showExpiryDropdown && (
                    <div className={`${styles.dropdownMenu} ${styles.expiryDropdown}`}>
                      {expiryOptions.map(option => (
                        <div 
                          key={option}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setExpiryTime(option);
                            setShowExpiryDropdown(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connect Wallet Button */}
            {!authenticated ? (
              <button className={styles.mainConnectBtn} onClick={login}>
                Connect wallet
              </button>
            ) : (
              <button className={styles.mainConnectBtn}>
                Place Limit Order
              </button>
            )}
          </div>

          {/* TradingView Alert Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Set up TradingView Alert</h2>
            </div>
            
            <div className={styles.alertSection}>
              <div className={styles.inputGroup}>
                <label>Alert Name</label>
                <input 
                  type="text" 
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                  placeholder="Enter alert name"
                  className={styles.alertInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Alert Message</label>
                <div className={styles.inputWithCopy}>
                  <input 
                    type="text" 
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className={styles.alertInput}
                  />
                  <button 
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard(alertMessage)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Webhook URL</label>
                <div className={styles.inputWithCopy}>
                  <input 
                    type="text" 
                    value={webhookUrl}
                    readOnly
                    className={`${styles.alertInput} ${styles.readonly}`}
                  />
                  <button 
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default TradingInterface;