import React, { useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const StateContext = createContext();
export const StateContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const contract = null;

  const address = "6628d27cb350e411b58a4b90";


  const publishCampaign = async (form) => {
    try {
      const formData = {
        owner: address,
        title: form.title,
        description: form.description,
        target: form.target,
        deadline: form.deadline,
        image: form.image
      };
      const response = await axios.post('http://localhost:8000/api/campaign/create', formData);
      console.log("contract call success", response.data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  }

  const getCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/campaign/getall');
      const campaigns = response.data;
      const parsedCampaigns = campaigns.map((campaign) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: campaign.target,
        deadline: campaign.deadline,
        amountCollected: (campaign.amountCollected).toString(),
        image: campaign.image,
        pId: campaign._id
      }));
      return parsedCampaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  const getUserCampaigns = async () => {
    const response = await axios.get('http://localhost:8000/api/campaign/getall');

    const allCampaigns = response.data;

    console.log(allCampaigns)

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  // PID is campaign id

  const initPayment = (data, pid, amount) =>{
    const options = {
      key:"rzp_test_Bq6H5OBCpA4XMl",
      amount: data.amount,
      currency: data.currency,
      description: "Test Transaction",
      order_id: data.id,
      handler: async ()=>{
        try {
          const apiUrl = "http://localhost:8000/api/campaign/donate";
          const response = await axios.post(apiUrl,{amount:amount, userId:address, pid:pid})
          if(response.data.success){
            console.log("Payment done data updated")
            navigate(`/campaign-details/${pid}`)
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }

      },
      theme: {
        color:"#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const donate = async (pId, amount) => {
    try {

      const donateUrl = "http://localhost:8000/create-checkout-session";
      const {data} = await axios.post(donateUrl, {amount:amount, userId:address, pid:pId});
      console.log(data)
      const Data = data.data;
      initPayment(Data, pId, amount);
      return "true";
    } catch (error) {
      console.error('Error donating:', error);
      throw error; 
    }
  };
  
  async function getDonations(pId) {
    try {
      const response = await axios.get(`http://localhost:8000/api/campaign/donations/${pId}`);

      
      const parsedDonations = response.data;

      return parsedDonations;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error; 
    }
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);