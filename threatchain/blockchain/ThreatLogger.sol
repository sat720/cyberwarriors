// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ThreatLogger
 * @dev Stores immutable proof of security alerts for forensic auditing.
 */
contract ThreatLogger {
    
    struct SecurityEvent {
        uint256 timestamp;
        string ipAddress;
        string alertType;
        bytes32 dataHash; // SHA-256 hash of the full log data
    }

    // Mapping from Alert ID to the Event Data
    mapping(string => SecurityEvent) public alerts;
    
    // List of all alert IDs for enumeration
    string[] public alertIds;

    // Owner of the contract (The Backend Server)
    address public owner;

    event AlertLogged(string indexed alertId, string ipAddress, string alertType);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the security system can log alerts");
        _;
    }

    /**
     * @dev Log an alert to the blockchain.
     * @param _alertId Unique ID from MongoDB
     * @param _ipAddress Attacker's IP
     * @param _alertType Type of attack (e.g. BRUTE_FORCE)
     * @param _dataHash Hash of the JSON log (integrity proof)
     */
    function logAlert(
        string memory _alertId, 
        string memory _ipAddress, 
        string memory _alertType, 
        bytes32 _dataHash
    ) public onlyOwner {
        
        alerts[_alertId] = SecurityEvent({
            timestamp: block.timestamp,
            ipAddress: _ipAddress,
            alertType: _alertType,
            dataHash: _dataHash
        });

        alertIds.push(_alertId);

        emit AlertLogged(_alertId, _ipAddress, _alertType);
    }

    /**
     * @dev Verify if a local log matches the blockchain record
     */
    function verifyLog(string memory _alertId, bytes32 _localHash) public view returns (bool) {
        return alerts[_alertId].dataHash == _localHash;
    }
}
