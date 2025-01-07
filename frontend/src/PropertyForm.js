import React, { useState } from "react";
import axios from "axios";

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    total_sqft: "",
    bath: "",
    size: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // List of locations for the dropdown
  const locations = [
    "1St Block Jayanagar", "1St Phase Jp Nagar", "2Nd Phase Judicial Layout", "2Nd Stage Nagarbhavi", 
"5Th Block Hbr Layout", "5Th Phase Jp Nagar", "6Th Phase Jp Nagar", "7Th Phase Jp Nagar", 
"8Th Phase Jp Nagar", "9Th Phase Jp Nagar", "Aecs Layout", "Abbigere", "Akshaya Nagar", 
"Ambalipura", "Ambedkar Nagar", "Amruthahalli", "Anandapura", "Ananth Nagar", "Anekal", 
"Anjanapura", "Ardendale", "Arekere", "Attibele", "Beml Layout", "Btm 2Nd Stage", "Btm Layout", 
"Babusapalaya", "Badavala Nagar", "Balagere", "Banashankari", "Banashankari Stage Ii", 
"Banashankari Stage Iii", "Banashankari Stage V", "Banashankari Stage Vi", "Banaswadi", 
"Banjara Layout", "Bannerghatta", "Bannerghatta Road", "Basavangudi", "Basaveshwara Nagar", 
"Battarahalli", "Begur", "Begur Road", "Bellandur", "Benson Town", "Bharathi Nagar", "Bhoganhalli", 
"Billekahalli", "Binny Pete", "Bisuvanahalli", "Bommanahalli", "Bommasandra", 
"Bommasandra Industrial Area", "Bommenahalli", "Brookefield", "Budigere", "Cv Raman Nagar", 
"Chamrajpet", "Chandapura", "Channasandra", "Chikka Tirupathi", "Chikkabanavar", "Chikkalasandra", 
"Choodasandra", "Cooke Town", "Cox Town", "Cunningham Road", "Dasanapura", "Dasarahalli", 
"Devanahalli", "Devarachikkanahalli", "Dodda Nekkundi", "Doddaballapur", "Doddakallasandra", 
"Doddathoguru", "Domlur", "Dommasandra", "Epip Zone", "Electronic City", "Electronic City Phase Ii", 
"Electronics City Phase 1", "Frazer Town", "Gm Palaya", "Garudachar Palya", "Giri Nagar", 
"Gollarapalya Hosahalli", "Gottigere", "Green Glen Layout", "Gubbalala", "Gunjur", "Hal 2Nd Stage", 
"Hbr Layout", "Hrbr Layout", "Hsr Layout", "Haralur Road", "Harlur", "Hebbal", "Hebbal Kempapura", 
"Hegde Nagar", "Hennur", "Hennur Road", "Hoodi", "Horamavu Agara", "Horamavu Banaswadi", "Hormavu", 
"Hosa Road", "Hosakerehalli", "Hoskote", "Hosur Road", "Hulimavu", "Isro Layout", "Itpl", 
"Iblur Village", "Indira Nagar", "Jp Nagar", "Jakkur", "Jalahalli", "Jalahalli East", "Jigani", 
"Judicial Layout", "Kr Puram", "Kadubeesanahalli", "Kadugodi", "Kaggadasapura", "Kaggalipura", 
"Kaikondrahalli", "Kalena Agrahara", "Kalyan Nagar", "Kambipura", "Kammanahalli", "Kammasandra", 
"Kanakapura", "Kanakpura Road", "Kannamangala", "Karuna Nagar", "Kasavanhalli", "Kasturi Nagar", 
"Kathriguppe", "Kaval Byrasandra", "Kenchenahalli", "Kengeri", "Kengeri Satellite Town", 
"Kereguddadahalli", "Kodichikkanahalli", "Kodigehaali", "Kodigehalli", "Kodihalli", "Kogilu", 
"Konanakunte", "Koramangala", "Kothannur", "Kothanur", "Kudlu", "Kudlu Gate", "Kumaraswami Layout", 
"Kundalahalli", "Lb Shastri Nagar", "Laggere", "Lakshminarayana Pura", "Lingadheeranahalli", 
"Magadi Road", "Mahadevpura", "Mahalakshmi Layout", "Mallasandra", "Malleshpalya", "Malleshwaram", 
"Marathahalli", "Margondanahalli", "Marsur", "Mico Layout", "Munnekollal", "Murugeshpalya", 
"Mysore Road", "Ngr Layout", "Nri Layout", "Nagarbhavi", "Nagasandra", "Nagavara", "Nagavarapalya", 
"Narayanapura", "Neeladri Nagar", "Nehru Nagar", "Ombr Layout", "Old Airport Road", "Old Madras Road", 
"Padmanabhanagar", "Pai Layout", "Panathur", "Parappana Agrahara", "Pattandur Agrahara", 
"Poorna Pragna Layout", "Prithvi Layout", "R.T. Nagar", "Rachenahalli", "Raja Rajeshwari Nagar", 
"Rajaji Nagar", "Rajiv Nagar", "Ramagondanahalli", "Ramamurthy Nagar", "Rayasandra", 
"Sahakara Nagar", "Sanjay Nagar", "Sarakki Nagar", "Sarjapur", "Sarjapur Road", 
"Sarjapura - Attibele Road", "Sector 2 Hsr Layout", "Sector 7 Hsr Layout", "Seegehalli", "Shampura", 
"Shivaji Nagar", "Singasandra", "Somasundara Palya", "Sompura", "Sonnenahalli", "Subramanyapura", 
"Sultan Palaya", "Tc Palaya", "Talaghattapura", "Thanisandra", "Thigalarapalya", "Thubarahalli", 
"Tindlu", "Tumkur Road", "Ulsoor", "Uttarahalli", "Varthur", "Varthur Road", "Vasanthapura", 
"Vidyaranyapura", "Vijayanagar", "Vishveshwarya Layout", "Vishwapriya Layout", "Vittasandra", 
"Whitefield", "Yelachenahalli", "Yelahanka", "Yelahanka New Town", "Yelenahalli", "Yeshwanthpur"

  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("There was an error submitting your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="relative min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Real Estate Price Prediction
            </h1>
            <p className="text-lg text-gray-600">
              Get accurate property price estimates using our advanced AI model
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Property Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      name="location"
                      className="w-full px-4 py-2 bg-white/90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a location</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size(e.g., 2 BHK)
                    </label>
                    <input
                      type="number"
                      name="size"
                      placeholder="Enter Size"
                      className="w-full px-4 py-2 bg-white/90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      value={formData.size}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Sqft
                    </label>
                    <input
                      type="number"
                      name="total_sqft"
                      placeholder="Enter total square feet"
                      className="w-full px-4 py-2 bg-white/90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      value={formData.total_sqft}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bath"
                      placeholder="Enter number of bathrooms"
                      className="w-full px-4 py-2 bg-white/90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      value={formData.bath}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                  >
                    {loading ? "Calculating..." : "Get Price Prediction"}
                  </button>
                </form>
              </div>

              <div className="flex flex-col justify-center">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {prediction && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Estimated Property Value
                    </h3>
                    <div className="text-4xl font-bold text-blue-600 mb-4">
                      $
                      {typeof prediction === "number"
                        ? prediction.toLocaleString()
                        : prediction}
                    </div>
                    <p className="text-gray-600">
                      This estimate is based on current market trends and
                      similar properties in your selected location.
                    </p>
                  </div>
                )}

                {!prediction && !error && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Ready to Get Started?
                    </h3>
                    <p className="text-gray-600">
                      Fill in your property details to receive an instant price
                      prediction powered by our advanced AI model.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;



